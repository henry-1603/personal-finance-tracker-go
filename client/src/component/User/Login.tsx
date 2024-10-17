import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axiosConfig";  // Import from axiosConfig

const Login: React.FC = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState(""); // Changed state to usernameOrEmail
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // Send the updated payload with usernameOrEmail
      const response = await axios.post("/login", { usernameOrEmail, password });
      const token = response?.data?.token; // Adjust this based on your API response
      localStorage.setItem("token", token); // Store token in local storage
      navigate("/dashboard");
    } catch (error) {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="usernameOrEmail" className="block text-sm font-medium text-gray-700">Username or Email</label>
            <input
              type="text"
              id="usernameOrEmail"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account? <a href="/register" className="text-indigo-600 hover:underline">Register</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
