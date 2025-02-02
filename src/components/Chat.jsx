import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../css/Chat.css';
import { useNavigate } from 'react-router-dom';

const Chat = ({ userId, otherUserId, onClose }) => {
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null); // To reference the last message for scrolling
    const navigate = useNavigate(); // Initialize navigate function

    // Fetch message history when component mounts or userIds change
    useEffect(() => {
        const fetchMessages = async () => {
            if (!userId || !otherUserId) return;
            try {
                const response = await axios.get(`http://localhost:5000/API/getMessageHistory/${userId}/${otherUserId}`);
                setMessages(response.data.messages || []);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();
    }, [userId, otherUserId]);

    // Scroll to the bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) {
            console.error('Message cannot be empty');
            return;
        }

        const message = {
            senderId: userId,
            receiverId: otherUserId,
            text: newMessage
        };

        try {
            const response = await axios.post('https://hackthon-backend-u9ee.onrender.com/API/sendMessage', message);
            setMessages(prevMessages => [...prevMessages, response.data.message]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    // onClose handler for closing the chat and navigating back
    const closeChat = () => {
        if (onClose) onClose(); // Call the onClose prop function if passed
        navigate('/dashboard'); // Navigate to the dashboard route
    };

    return (
        <div className="chat-container">
            <div className="chat-window">
                {/* Close Button */}
                <div className="close-btn" onClick={closeChat}>
                    <span>&times;</span> {/* The "X" icon */}
                </div>

                <div className="messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={msg.senderId === userId ? "message-sent" : "message-received"}>
                            <strong>{msg.senderId === userId ? 'You' : msg.senderId}: </strong>{msg.text}
                        </div>
                    ))}
                    {/* Empty div to act as scroll target */}
                    <div ref={messagesEndRef} />
                </div>

                <div className="message-input">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                    />
                    <button onClick={handleSendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
