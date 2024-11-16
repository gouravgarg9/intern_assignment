// src/pages/CarList.js
import React, { useEffect, useState } from 'react';
import { getCars, deleteCar } from '../services/api';
import Navbar from '../components/Navbar'; // Import Navbar component

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]); // State for filtered cars
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCars = async () => {
      const { data } = await getCars();
      setCars(data);
      setFilteredCars(data); // Initially, show all cars
    };
    fetchCars();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query === '') {
      setFilteredCars(cars); // If search is empty, show all cars
    } else {
      const lowerCaseQuery = query.toLowerCase();
      const result = cars.filter((car) =>
        car.title.toLowerCase().includes(lowerCaseQuery) ||
        car.description.toLowerCase().includes(lowerCaseQuery) ||
        car.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery))
      );
      setFilteredCars(result);
    }
  };

  const handleDelete = async (id) => {
    await deleteCar(id);
    setCars(cars.filter(car => car._id !== id));
    setFilteredCars(filteredCars.filter(car => car._id !== id)); // Remove deleted car from filtered list
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Navbar component with search functionality */}
      <Navbar onSearch={handleSearch} />

      <h2 className="text-3xl font-bold text-gray-800 mb-6">My Cars</h2>

      {/* Display message if no cars match the search */}
      {filteredCars.length === 0 && searchQuery && (
        <p className="text-red-500">No cars found matching your search criteria.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCars.map((car) => (
          <div
            key={car._id}
            className="bg-white rounded-lg shadow-lg p-4 flex flex-col justify-between"
          >
            <div>
              {/* Title with truncation */}
              <h3 className="text-xl font-semibold text-gray-700 truncate">
                {car.title}
              </h3>

              {/* Description with truncation */}
              <p className="text-gray-600 mt-2 line-clamp-3">
                {car.description}
              </p>
            </div>

            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => (window.location.href = `/cars/${car._id}`)}
                className="bg-green-500 text-white px-3 py-1 rounded shadow hover:bg-green-600"
              >
                View
              </button>
              <button
                onClick={() => handleDelete(car._id)}
                className="bg-red-500 text-white px-3 py-1 rounded shadow hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarList;
