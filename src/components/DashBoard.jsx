import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Chat from './Chat';
import '../css/Dashboard.css';

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
    const [profileExists, setProfileExists] = useState(true);
    const [activeUser, setActiveUser] = useState(null);
    const [otherUser, setOtherUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const email = sessionStorage.getItem('email');
    const username = sessionStorage.getItem('username');

    useEffect(() => {
        if (!email) {
            navigate('/login');
            return;
        }

        const checkUserProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/API/getProfile/${email}`);
                if (response.data.message === "Profile not found") {
                    setProfileExists(false);
                    navigate('/ProfileForm');
                } else {
                    setProfileExists(true);
                }
            } catch (error) {
                console.error('Error checking profile:', error);
                setError('Error checking profile. Please try again later.');
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/API/getAllUsers/${email}`);
                setUsers(response.data.users);
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('Error fetching users. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        checkUserProfile();
        fetchUsers();
    }, [navigate, email]);

    useEffect(() => {
        if (activeUser && otherUser) {
            sessionStorage.setItem('sender-email', activeUser);
            sessionStorage.setItem('receiver-email', otherUser);
        }
    }, [activeUser, otherUser]);

    const updateProfileClick = () => {
        navigate('/UpdateProfile');
    };

    const openChat = (userId, otherUserId) => {
        setActiveUser(userId);
        setOtherUser(otherUserId);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredUsers = users.filter((user) => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        return (
            user.username.toLowerCase().includes(lowercasedSearchTerm) ||
            user.email.toLowerCase().includes(lowercasedSearchTerm) ||
            (user.skills && user.skills.some(skill => skill.toLowerCase().includes(lowercasedSearchTerm))) ||
            (user.description && user.description.toLowerCase().includes(lowercasedSearchTerm))
        );
    });

    // Function to handle closing the chat
    const closeChat = () => {
        setActiveUser(null);
        setOtherUser(null);
    };

    return (
        <div className="dashboard-container">
            <div className="profile-icon" onClick={updateProfileClick}>
                <i className="fa fa-user-circle" aria-hidden="true"></i>{username}
            </div>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>

            <div className="user-profiles-section">
                <h2>Users</h2>
                {loading ? (
                    <p className="loading-message">Loading profiles...</p>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : filteredUsers.length === 0 ? (
                    <p>No users found</p>
                ) : (
                    <div className="users-grid">
                        {filteredUsers.map((user) => (
                            <div key={user._id} className="user-card">
                                <div className="user-icon">
                                    <i className="fa fa-user-circle" aria-hidden="true"></i>
                                    <span className="username">{user.username}</span>
                                </div>
                                <div className="user-info">
                                    <h3>{user.email}</h3>
                                    <p><strong>Language:</strong> {Array.isArray(user.language) ? user.language.join(', ') : 'Not provided'}</p>
                                    <p><strong>Country:</strong> {Array.isArray(user.country) ? user.country.join(', ') : 'Not provided'}</p>
                                    <p><strong>Skills:</strong> {Array.isArray(user.skills) ? user.skills.join(', ') : 'Not provided'}</p>
                                    <p><strong>Description:</strong> {user.description || 'Not provided'}</p>
                                    <p><strong>Hobbies:</strong> {Array.isArray(user.hobbies) ? user.hobbies.join(', ') : 'Not provided'}</p>
                                    <p><strong>Contact:</strong> {user.contactNumber || 'Not provided'}</p>
                                    <button className="chat-btn" onClick={() => openChat(email, user.email)}>Chat</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {activeUser && otherUser && <Chat userId={activeUser} otherUserId={otherUser} onClose={closeChat} />}
        </div>
    );
};

export default Dashboard;
