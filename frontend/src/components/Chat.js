// import React, { useState, useEffect } from 'react';
// import { Input, Button, List } from 'antd';

// const Chat = ({ user }) => {
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [receiverId, setReceiverId] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         setIsLoading(true);
//         const token = localStorage.getItem('token');
//         const response = await fetch('http://localhost:5000/api/user/chat/', {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const data = await response.json();
//         console.log("YOYO:",data);
//         setMessages(data.messages);
//       } catch (error) {
//         console.error('Error fetching messages:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchMessages();
//   }, []);

//   const handleSendMessage = async () => {
//     if (message.trim()) {
//       const newMessage = {
//         senderId: user._id,
//         receiverId,
//         message,
//       };

//       try {
//         const token = localStorage.getItem('token');
//         const response = await fetch('http://localhost:5000/api/user/chat/message', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(newMessage),
//         });

//         if (response.ok) {
//           setMessages([...messages, newMessage]);
//           setMessage('');
//         } else {
//           console.error('Failed to send message:', response.statusText);
//         }
//       } catch (error) {
//         console.error('Error sending message:', error);
//       }
//     }
//   };

//   return (
//     <div>
//       <h2>Chat</h2>
//       <Input
//         placeholder="Receiver ID"
//         value={receiverId}
//         onChange={(e) => setReceiverId(e.target.value)}
//       />
//       <List
//         loading={isLoading}
//         dataSource={messages}
//         renderItem={(msg) => (
//           <List.Item>
//             <strong>{msg.senderId === user._id ? 'You' : 'Other'}: </strong>
//             {msg.message}
//           </List.Item>
//         )}
//       />
//       <Input
//         placeholder="Type a message"
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         onPressEnter={handleSendMessage}
//       />
//       <Button type="primary" onClick={handleSendMessage}>
//         Send
//       </Button>
//     </div>
//   );
// };

// export default Chat;


import React, { useState, useEffect } from 'react';
import { Input, Button, List } from 'antd';

const Chat = ({ user }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [receiverId, setReceiverId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/user/chat/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log("YOYO:",data);
        // Assuming data is an array and the first object contains the messages
        if (Array.isArray(data) && data.length > 0 && data[0].messages) {
          setMessages(data[0].messages);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 1000);

  // Clear the interval on component unmount
  return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async () => {
    if (message.trim()) {
      const newMessage = {
        senderId: user._id,
        receiverId,
        message,
      };

      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/user/chat/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newMessage),
        });

        if (response.ok) {
          setMessages([...messages, newMessage]);
          setMessage('');
        } else {
          console.error('Failed to send message:', response.statusText);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <div>
      <h2>Chat</h2>
      <Input
        placeholder="Receiver ID"
        value={receiverId}
        onChange={(e) => setReceiverId(e.target.value)}
      />
      <List
        loading={isLoading}
        dataSource={messages}
        renderItem={(msg) => (
          <List.Item>
            <strong>{msg.sender === user._id ? 'You' : 'Other'}: </strong>
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
