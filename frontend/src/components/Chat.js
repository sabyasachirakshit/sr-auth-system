import React, { useState, useEffect } from "react";
import { Input, Button, List, Select } from "antd";

const { Option } = Select;

const Chat = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [receiverId, setReceiverId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5000/api/user/chat/users",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        console.log("USERS:",data);
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const fetchMessages = async (participantId) => {
    console.log(participantId);
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/user/chat/${participantId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      // Assuming data is an array and the first object contains the messages
      if (Array.isArray(data) && data.length > 0 && data[0].messages) {
        setMessages(data[0].messages);
      } else {
        setMessages([]); // If no messages, clear the list
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (receiverId) {
      fetchMessages(receiverId);
    }
  }, [receiverId]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      const newMessage = {
        senderId: user._id,
        receiverId,
        message,
      };

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5000/api/user/chat/message",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newMessage),
          }
        );

        if (response.ok) {
          setMessages([...messages, newMessage]);
          setMessage("");
        } else {
          console.error("Failed to send message:", response.statusText);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <div>
      <h2>Chat</h2>
      <Select
        placeholder="Select a user to chat"
        value={receiverId}
        onChange={(value) => setReceiverId(value)}
        style={{ width: "100%", marginBottom: "10px" }}
      >
        {users.map((user) => (
          <Option key={user._id} value={user._id}>
            {user.username}
          </Option>
        ))}
      </Select>
      <List
        loading={isLoading}
        dataSource={messages}
        renderItem={(msg) => (
          <List.Item>
            <strong>{msg.sender === user._id ? "You" : "Other"}: </strong>
            {msg.message}
          </List.Item>
        )}
      />
      <Input
        placeholder="Type a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onPressEnter={handleSendMessage}
      />
      <Button type="primary" onClick={handleSendMessage}>
        Send
      </Button>
    </div>
  );
};

export default Chat;
