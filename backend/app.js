// app.js
const express = require('express');
const mongoose = require('mongoose');
const http = require("http");
const socketIo = require("socket.io");
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const chatRoutes = require("./routes/chat");
const todoRoutes = require('./routes/todo');
const Chat = require("./models/ChatModel");
const config = require('./config');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Update this to your frontend URL if different
    methods: ["GET", "POST"],
    allowedHeaders: ["Authorization"],
    credentials: true
  }
});

// Connect to MongoDB
mongoose.connect(config.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/user/chat', chatRoutes);
app.use('/api/todo', todoRoutes);

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
    // Handle message saving in database
    try {
      let chat = await Chat.findOne({
        participants: { $all: [senderId, receiverId] },
      });

      if (!chat) {
        chat = new Chat({
          participants: [senderId, receiverId],
          messages: [{ sender: senderId, message }],
        });
      } else {
        chat.messages.push({ sender: senderId, message });
      }

      await chat.save();

      // Emit the message to both participants
      io.emit("receiveMessage", {
        senderId,
        receiverId,
        message,
      });
    } catch (err) {
      console.error(err.message);
    }
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
