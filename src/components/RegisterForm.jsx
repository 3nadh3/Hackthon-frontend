import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [respond, setRespond] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Handle Registration Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('https://hackthon-backend-u9ee.onrender.com/Registration', { email, password, username });
      const data = response.data;

      if (data.message === 'User registered successfully.') {
        alert('User Registered successfully.');
        setTimeout(() => {
          navigate('/login'); // Redirect to login page after 3 seconds
        }, 3000); // 3 seconds delay
      } else if (data.message === 'User registration failed: username already exists') {
        alert('User already exists');
      }
      setRespond(data.message);
    } catch (error) {
      console.error('Error during registration:', error);
      setRespond('Error registering user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="header">
        <h2>Register Form</h2>
      </div>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <input
            className="input"
            type="email"
            placeholder={respond === 'User registration failed: username already exists' ? 'Email already exists' : 'Email'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <input
            className="input"
            type="text"
            placeholder="How should we address you?"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />
          <input
            className="input"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter password"
            aria-label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <div className="show-password-container">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={togglePasswordVisibility}
            />
            <label htmlFor="showPassword">Show Password</label>
          </div>
          <br />
          <input className="submitButton" type="submit" value="Submit" />
          <p>
            Already a user?{' '}
            <a
              href="#"
              className="link"
              onClick={(e) => {
                e.preventDefault();
                navigate('/login'); // Redirect to login page
              }}
            >
              Click here
            </a>
          </p>
        </form>
      </div>
      {loading && <ClipLoader size={35} color={'#123abc'} loading={loading} />}
    </>
  );
};

export default RegisterForm;
