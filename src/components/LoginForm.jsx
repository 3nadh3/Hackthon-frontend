import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/loginpage.css';

const LoginForm = () => {
  
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const Login = async (e) => {
      e.preventDefault();
      try {
          const response = await axios.post('http://localhost:5000/API/Login', { email: username, password });
  
          // Check for successful login
          if (response.data.isLogin === true) {
            setMessage('Login Successful');
            sessionStorage.setItem('token', response.data.token);  // Store token
            sessionStorage.setItem('username', response.data.username);          // Store username
            sessionStorage.setItem('email', response.data.email);
            sessionStorage.setItem('user', JSON.stringify(response.data.user)); // Optionally store full user data
            navigate('/Dashboard');  // Redirect to dashboard
        }   else if (response.data.isPasswordCorrect === false) {
              setMessage("Invalid credentials");
          } else if (response.data.isExist === false) {
              setMessage("User doesn't exist");
              navigate('/RegisterForm');  // Redirect to register if user doesn't exist
          }
      } catch (error) {
          setMessage('An error occurred during login');
      }
  }
  
    return (
        <>
            <div className="header">
                <h2>Login</h2>
            </div>
            <div className="container">
                <form onSubmit={Login}>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Enter username"
                        onChange={(e) => setUsername(e.target.value)}
                        className="input"
                    />
                    <br />
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Enter Password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="input"
                    />
                    <br />
                    <input type="submit" value="Login" className="submitButton" />
                    <p>
                        Not registered?{' '}
                        <a
                            href=""
                            onClick={() => navigate('/RegisterForm')}
                            className="link"
                        >
                            Click here
                        </a>
                    </p>
                </form>
                {message && <p className="message">{message}</p>}
            </div>
        </>
    );
}

export default LoginForm;
