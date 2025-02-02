import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/UpdatedProfile.css'; // Import the CSS file for styling

const UpdateProfile = () => {
    const [language, setLanguage] = useState('');
    const [country, setCountry] = useState('');
    const [skills, setSkills] = useState('');
    const [hobbies, setHobbies] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [description, setDescription] = useState('');
    const [languages, setLanguages] = useState([]);
    const [countries, setCountries] = useState([]);
    const [skillList, setSkillList] = useState([]);
    const [hobbiesList, setHobbiesList] = useState([]);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const email = sessionStorage.getItem('email');
    
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/API/getProfile/${email}`);
                if (response.data.profile) {
                    setLanguages(response.data.profile.language || []);
                    setCountries(response.data.profile.country || []);
                    setSkillList(response.data.profile.skills || []);
                    setHobbiesList(response.data.profile.hobbies || []);
                    setContactNumber(response.data.profile.contactNumber || '');
                    setDescription(response.data.profile.description || '');
                } else {
                    navigate('/createProfile');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, [email, navigate]);

    const handleAddLanguage = () => {
        if (language) {
            setLanguages([...languages, language]);
            setLanguage('');
        }
    };

    const handleAddCountry = () => {
        if (country) {
            setCountries([...countries, country]);
            setCountry('');
        }
    };

    const handleAddSkill = () => {
        if (skills) {
            setSkillList([...skillList, skills]);
            setSkills('');
        }
    };

    const handleAddHobby = () => {
        if (hobbies) {
            setHobbiesList([...hobbiesList, hobbies]);
            setHobbies('');
        }
    };

    const handleRemove = (type, value) => {
        if (type === 'language') {
            setLanguages(languages.filter(item => item !== value));
        } else if (type === 'country') {
            setCountries(countries.filter(item => item !== value));
        } else if (type === 'skill') {
            setSkillList(skillList.filter(item => item !== value));
        } else if (type === 'hobby') {
            setHobbiesList(hobbiesList.filter(item => item !== value));
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put('https://hackthon-backend-u9ee.onrender.com/API/updateProfile', {
                email,
                language: languages,
                country: countries,
                skills: skillList,
                hobbies: hobbiesList,
                contactNumber,
                description
            });

            setMessage('Profile updated successfully');
            navigate('/dashboard');
        } catch (error) {
            setMessage('Error updating profile');
        }
    };

    const handleBackToDashboard = () => {
        navigate('/dashboard'); // Navigate back to the dashboard
    };

    return (
        <>
        <div className="update-profile-container">
            <h2 className="title">Update Profile</h2>
            <form onSubmit={handleUpdateProfile} className="update-profile-form">
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Language"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="input-field"
                    />
                    <button type="button" onClick={handleAddLanguage} className="add-button">Add Language</button>
                    <div className="list-container">
                        {languages.map((lang, index) => (
                            <div key={index} className="list-item">
                                <span>{lang}</span>
                                <button type="button" onClick={() => handleRemove('language', lang)} className="remove-button">X</button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="input-field"
                    />
                    <button type="button" onClick={handleAddCountry} className="add-button">Add Country</button>
                    <div className="list-container">
                        {countries.map((cnt, index) => (
                            <div key={index} className="list-item">
                                <span>{cnt}</span>
                                <button type="button" onClick={() => handleRemove('country', cnt)} className="remove-button">X</button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Skills"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        className="input-field"
                    />
                    <button type="button" onClick={handleAddSkill} className="add-button">Add Skill</button>
                    <div className="list-container">
                        {skillList.map((skill, index) => (
                            <div key={index} className="list-item">
                                <span>{skill}</span>
                                <button type="button" onClick={() => handleRemove('skill', skill)} className="remove-button">X</button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Hobbies"
                        value={hobbies}
                        onChange={(e) => setHobbies(e.target.value)}
                        className="input-field"
                    />
                    <button type="button" onClick={handleAddHobby} className="add-button">Add Hobby</button>
                    <div className="list-container">
                        {hobbiesList.map((hobby, index) => (
                            <div key={index} className="list-item">
                                <span>{hobby}</span>
                                <button type="button" onClick={() => handleRemove('hobby', hobby)} className="remove-button">X</button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Contact"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        className="input-field"
                    />
                </div>

                <div className="input-group">
                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="input-field"
                    />
                </div>

                <button type="submit" className="submit-button">Update Profile</button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
        <button onClick={handleBackToDashboard} className="close-button">
                <i className="fa fa-times" style={{ fontSize: '24px', color: '#333' }}></i>
            </button>
        </>
    );
};

export default UpdateProfile;
