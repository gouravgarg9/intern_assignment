import axios from 'axios';
 export const API_URL = process.env.REACT_APP_API_URL; // Update this with your deployed backend URL

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('token'); // Clear expired token
      window.location.href = '/login'; // Redirect to login
    }
    return Promise.reject(error);
  }
);

// Set token in headers
export const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Auth Services
export const signup = (userData) => axios.post(`${API_URL}/auth/signup`, userData);
export const login = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/login`, userData);
  
  // Assume the token is in response.data.token
  const token = response.data.token;
  if (token) {
    localStorage.setItem('token', token); // Store token
    setAuthToken(token); // Set token in headers
  }

  return response;
};
// Car Services
export const getCars = () => axios.get(`${API_URL}/cars`);
export const addCar = (carData) => axios.post(`${API_URL}/cars`, carData);
export const getCarById = (id) => axios.get(`${API_URL}/cars/${id}`);
export const updateCarDescription = (id, carData) => axios.put(`${API_URL}/cars/${id}`, carData);

export const deleteCar = (id) => axios.delete(`${API_URL}/cars/${id}`);
