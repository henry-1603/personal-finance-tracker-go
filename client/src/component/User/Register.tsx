import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";


const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  interface UserResponse { 
    data : {
      token :string
      message :string
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      username,
      password,
      email,
    };

    try {
      const response : UserResponse = await axios.post(`/register`, payload);
      setSuccess(response.data.message);
      console.log(response)
      const token = response?.data?.token; // Adjust this based on your API response
      localStorage.setItem('token', token); // Store token in local storage
      navigate("/dashboard");
      setError('');
    } catch (error: any) {
      setError(error.response?.data || 'Registration failed');
      setSuccess('');
    }
  };

  return (
    <div className="register-form">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
};

export default Register;
