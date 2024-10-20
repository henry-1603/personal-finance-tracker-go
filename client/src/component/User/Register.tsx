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
      token : string;
      message : string;
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
      const response: UserResponse = await axios.post(`/register`, payload);
      setSuccess(response.data.message);
      console.log(response);
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
    <div className="flex items-center justify-center min-h-screen bg-[#040F30]">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">Register</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              className="mt-1 block w-full border border-gray-300 px-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-xl"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="mt-1 block w-full border border-gray-300 px-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm  font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="mt-1 block w-full border border-gray-300 px-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-xl"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Register
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account? <a href="/login" className="text-indigo-600 hover:underline">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
