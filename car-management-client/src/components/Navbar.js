// src/components/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token from localStorage
    navigate('/auth'); // Redirect to login page
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery); // Pass the search query to the parent component (CarList)
  };

  return (
    <nav className="flex justify-between items-center mb-6 p-4 bg-gray-800 text-white rounded-lg">
      <div className="text-xl font-bold">
        <Link to="/" className="hover:text-gray-300">Home</Link>
      </div>
      <div className="flex items-center space-x-4">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex items-center">
          <input
            type="text"
            placeholder="Search Cars"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 rounded-l bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 px-4 py-2 rounded-r text-white hover:bg-blue-600 focus:outline-none"
          >
            Search
          </button>
        </form>

        {/* Other Navbar Links */}
        <Link
          to="/cars/add"
          className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
        >
          Add New Car
        </Link>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
