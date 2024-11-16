// src/pages/UpdateCar.js
import React, { useState, useEffect } from 'react';
import { getCarById, updateCarDescription, API_URL } from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateCar = () => {
  const { id } = useParams(); // Get car ID from the URL
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const { data } = await getCarById(id);
        const { title, description, tags, images } = data;
        setTitle(title);
        setDescription(description);
        setTags(tags.join(', ')); // Convert tags array to a comma-separated string
        setExistingImages(images); // Store existing images separately
      } catch (err) {
        console.error('Error fetching car:', err);
        setError('Failed to load car details.');
      }
    };

    fetchCar();
  }, [id]);

  const handleUpdateCar = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', JSON.stringify(tags.split(','))); // Convert comma-separated tags to an array

    // Add new images to the form data
    images.forEach((image) => formData.append('images', image));

    // Include a list of images to keep
    formData.append('existingImages', JSON.stringify(existingImages));

    try {
      const token = localStorage.getItem('token');
      await updateCarDescription(id, formData);
      alert('Car updated successfully!');
      navigate('/cars');
    } catch (err) {
      console.error('Error updating car:', err);
      setError('Failed to update car.');
    }
  };

  const handleRemoveExistingImage = (image) => {
    setExistingImages((prev) => prev.filter((img) => img !== image));
  };

  const getPhotos = (e) => {
    const files = e.target.files;
    setImages((prev) => [...prev, ...files]);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-8">
      <form onSubmit={handleUpdateCar}>
        <h2 className="text-2xl font-bold mb-6 text-gray-700">Update Car</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Title */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">Title</label>
          <input
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">Description</label>
          <textarea
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        {/* Tags */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">Tags (comma-separated)</label>
          <input
            type="text"
            placeholder="e.g., SUV, Sedan, Dealer"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-2">Existing Images</label>
            <div className="flex flex-wrap gap-4">
              {existingImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={`${image}`}
                    alt={`Existing Image ${index + 1}`}
                    className="object-cover h-10 w-10 mx-1"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(image)}
                    className="absolute top--1 right--1 bg-red-500 text-white text-xs rounded-full p-1 shadow-md hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload New Images */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">Upload Additional Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={getPhotos}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
          />
        </div>

        {/* Image Preview Section */}
        {images.length > 0 && (
          <div className="flex flex-wrap gap-4 mb-6">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`New Image ${index + 1}`}
                  className="object-cover h-10 w-10 mx-1"
                />
                <button
                  type="button"
                  onClick={() => setImages((prev) => prev.filter((img) => img !== image))}
                  className="absolute top--1 right--1 bg-red-500 text-white text-xs rounded-full p-1 shadow-md hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
        >
          Update Car
        </button>
      </form>
    </div>
  );
};

export default UpdateCar;
