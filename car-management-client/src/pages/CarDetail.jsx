// src/pages/CarDetail.js
import React, { useEffect, useState } from 'react';
import { getCarById, deleteCar, API_URL } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const CarDetail = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const navigate = useNavigate();
  const [fullscreenImage, setFullscreenImage] = React.useState(null);


  const handleDelete = async (id) => {
    await deleteCar(id);
    alert('Car deleted successfully!');
    navigate('/cars')
  };

  useEffect(() => {
    const fetchCar = async () => {
      const { data } = await getCarById(id);
      setCar(data);
    };
    fetchCar();
  }, [id]);

  const handleUpdate = async () => {
    window.location.href = `/cars/update/${car._id}`
  };

  return car ? (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Car Title */}
      <h2 className="text-3xl font-bold text-gray-800 mb-4">{car.title}</h2>
  
      {/* Image Slider */}
      {car.images && car.images.length > 0 ? (
  <div className="relative w-full overflow-hidden rounded-lg shadow-lg">
    {/* Image Slider */}
    <div
      className="flex transition-transform duration-500 ease-in-out"
      style={{
        transform: `translateX(-${currentIndex * 100}%)`,
        width: `${car.images.length * 100}%`,
      }}
    >
      {car.images.map((image, index) => (
        <div
          key={index}
          className="w-full flex-shrink-0"
          style={{ width: "100%" }}
        >
          <img
            src={`${API_URL.split("/api")[0]}${image}`}
            alt={`Car Image ${index + 1}`}
            className="w-full h-64 object-cover rounded-md cursor-pointer"
            onClick={() => setFullscreenImage(`${API_URL.split("/api")[0]}${image}`)}
          />
        </div>
      ))}
    </div>

    {/* Navigation Buttons */}
    <button
      onClick={() =>
        setCurrentIndex((prev) =>
          prev === 0 ? car.images.length - 1 : prev - 1
        )
      }
      className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-700 text-white px-3 py-1 rounded-full shadow-lg hover:bg-gray-800 z-10"
    >
      ◀
    </button>
    <button
      onClick={() =>
        setCurrentIndex((prev) =>
          prev === car.images.length - 1 ? 0 : prev + 1
        )
      }
      className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-700 text-white px-3 py-1 rounded-full shadow-lg hover:bg-gray-800 z-10"
    >
      ▶
    </button>

    {/* Pagination Dots */}
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
      {car.images.map((_, index) => (
        <span
          key={index}
          onClick={() => setCurrentIndex(index)}
          className={`h-3 w-3 rounded-full cursor-pointer ${
            currentIndex === index
              ? "bg-blue-500"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
        />
      ))}
    </div>

    {/* Full-Screen Modal */}
    {fullscreenImage && (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
        <img
          src={fullscreenImage}
          alt="Fullscreen Car Image"
          className="max-w-full max-h-full rounded shadow-lg"
        />
        <button
          onClick={() => setFullscreenImage(null)}
          className="absolute top-4 right-4 text-white bg-gray-800 rounded-full px-3 py-1 shadow hover:bg-gray-900"
        >
          ✕
        </button>
      </div>
    )}
  </div>
) : (
  <p className="text-gray-500">No images available</p>
)}


  
      {/* Description Editor */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Description
        </label>
        <textarea disabled
          value={car.description}
          onChange={(e) => setCar({ ...car, description: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
          rows={4}
        />
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-600 mb-2">
          Tags
        </label>
        <textarea disabled
          value={car.tags.join(', ')}
          onChange={(e) => setCar({ ...car, description: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
          rows={4}
        />
      </div>
      
      {/* Update Button */}
      <button
        onClick={handleUpdate}
        className="mt-6 mx-5 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
      >
        Update
      </button>

      <button
                onClick={() => handleDelete(car._id)}
                className="mt-6 mx-5 bg-red-500 text-white px-6 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
              >
                Delete
              </button>

    </div>
  ) : (
    <p className="text-center text-gray-500">Loading...</p>
  );
  
};

export default CarDetail;
