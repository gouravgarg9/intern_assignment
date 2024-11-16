import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addCar } from '../services/api';

const AddCar = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const TITLE_MAX_LENGTH = 50; // Title maximum length
  const DESCRIPTION_MAX_LENGTH = 500; // Description maximum length
  const TAGS_MAX_COUNT = 10; // Maximum number of tags

  const getphotos = (e) => {
    const files = e.target.files;
    setImages((prev) => [...prev, ...files]);
  };

  const handleAddCar = async (e) => {
    e.preventDefault();

    const tagList = tags.split(',').map((tag) => tag.trim());
    if (tagList.length > TAGS_MAX_COUNT) {
      setError(`You can only add up to ${TAGS_MAX_COUNT} tags.`);
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', JSON.stringify(tagList));
    images.forEach((image) => formData.append('images', image));

    try {
      const token = localStorage.getItem('token');
      await addCar(formData);
      alert('Car added successfully!');
      navigate('/cars');
    } catch (err) {
      console.error('Error adding car:', err);
      setError('Failed to add car.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow-lg rounded-lg p-8">
      <form onSubmit={handleAddCar}>
        <h2 className="text-2xl font-bold mb-6 text-gray-700">Add New Car</h2>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Title */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Title
          </label>
          <input
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) =>
              e.target.value.length <= TITLE_MAX_LENGTH
                ? setTitle(e.target.value)
                : setError(`Title must not exceed ${TITLE_MAX_LENGTH} characters.`)
            }
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
          />
          <p className="text-xs text-gray-400">
            {title.length}/{TITLE_MAX_LENGTH} characters
          </p>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Description
          </label>
          <textarea
            placeholder="Enter description"
            value={description}
            onChange={(e) =>
              e.target.value.length <= DESCRIPTION_MAX_LENGTH
                ? setDescription(e.target.value)
                : setError(`Description must not exceed ${DESCRIPTION_MAX_LENGTH} characters.`)
            }
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
          />
          <p className="text-xs text-gray-400">
            {description.length}/{DESCRIPTION_MAX_LENGTH} characters
          </p>
        </div>

        {/* Tags */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            placeholder="e.g., SUV, Sedan, Dealer"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
          />
          <p className="text-xs text-gray-400">
            Tags must be comma-separated and up to {TAGS_MAX_COUNT} allowed.
          </p>
        </div>

        {/* Upload Additional Images */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Additional Images
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={getphotos}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
          />
        </div>

        {/* Image Preview Section */}
        {images && images.length > 0 && (
          <div className="flex flex-wrap gap-4 mb-6">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index + 1}`}
                  className="object-cover h-10 w-10 mx-1"
                />
                <button
                  type="button"
                  onClick={() =>
                    setImages((prev) => prev.filter((img) => img !== image))
                  }
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
          Add Car
        </button>
      </form>
    </div>
  );
};

export default AddCar;
