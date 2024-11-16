import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, signup } from '../services/api';

const Auth = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSignup, setIsSignup] = useState(false); // State to toggle between login and signup
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/cars'); // Redirect to /cars if already logged in
    }
  }, [navigate]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    try {
      if (isSignup) {
        await signup({ username, password });
        navigate('/auth');
      } else {
        const { data } = await login({ username, password });
        localStorage.setItem('token', data.token); // Store token in localStorage
        navigate('/cars'); // Redirect to car list
      }
    } catch (err) {
      console.error(isSignup ? 'Signup failed:' : 'Login failed:', err);
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-700 text-center">
        {isSignup ? 'Sign Up' : 'Login'}
      </h2>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 border border-red-300 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleAuth}>
        {/* Username Field */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-2 px-4 rounded focus:outline-none focus:ring ${
            isSignup ? 'bg-green-500 hover:bg-green-600 focus:ring-green-300 text-white' : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-300 text-white'
          }`}
        >
          {isSignup ? 'Sign Up' : 'Login'}
        </button>
      </form>

      {/* Toggle between Login and Sign Up */}
      <div className="mt-4 text-center">
        <span>{isSignup ? 'Already have an account?' : "Don't have an account?"} </span>
        <button
          onClick={() => setIsSignup(!isSignup)}
          className="text-blue-500 hover:underline"
        >
          {isSignup ? 'Login here' : 'Sign up here'}
        </button>
      </div>
    </div>
  );
};

export default Auth;
