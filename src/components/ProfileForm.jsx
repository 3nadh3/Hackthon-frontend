import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/DashPro.css'; // Import the CSS file for styling

const CreateProfile = () => {
    const [language, setLanguage] = useState('');
    const [country, setCountry] = useState('');
    const [skills, setSkills] = useState('');
    const [description, setDescription] = useState('');  // New field for description
    const [hobbies, setHobbies] = useState('');          // New field for hobbies
    const [contactNumber, setContactNumber] = useState('');  // New field for contact number
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const email = sessionStorage.getItem('email'); // Get email from sessionStorage
    const username = sessionStorage.getItem('username'); // Get username from sessionStorage
    const handleCreateProfile = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/API/createProfile', {
                email,
                username,  // Ensure the username is passed here
                language,
                country,
                skills,
                description,
                hobbies,
                contactNumber
            });
    
            console.log(response.data); // Log the server response
    
            setMessage(response.data.message);
            navigate('/dashboard'); // Redirect to dashboard after successful profile creation
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setMessage('A profile with this email already exists.');
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            } else {
                setMessage('Error creating profile');
            }
            console.error('Error creating profile:', error);
        }
    };
    
    return (
        <div className="create-profile-container">
            <h2 className="title">Create Profile</h2>
            <form onSubmit={handleCreateProfile} className="create-profile-form">
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Language"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="input-field"
                        required
                    />
                </div>
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="input-field"
                        required
                    />
                </div>
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Skills"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        className="input-field"
                        required
                    />
                </div>
                <div className="input-group">
                    <textarea
                        placeholder="Describe yourself"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="input-field"
                        required
                    />
                </div>
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Hobbies"
                        value={hobbies}
                        onChange={(e) => setHobbies(e.target.value)}
                        className="input-field"
                    />
                </div>
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Contact Number"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        className="input-field"
                        required
                    />
                </div>

                <button type="submit" className="submit-button">Create Profile</button>

                {message && <p className="message">{message}</p>}
            </form>
        </div>
    );
};

export default CreateProfile;
