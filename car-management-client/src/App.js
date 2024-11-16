import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from './pages/Auth';
import CarList from './pages/CarList';
import AddCar from './pages/AddCar';
import CarDetail from './pages/CarDetail';
import PrivateRoute from './components/PrivateRoute';
import { setAuthToken } from './services/api';
import { useLoading } from './context/LoadingContext';
import Spinner from './components/Spinner';
import UpdateCar from './pages/UpdateCar';

// Load token and set it in headers on app start
const token = localStorage.getItem('token');
if (token) {
  setAuthToken(token);
}

function App() {
  const { isLoading } = useLoading();

  return (
    <>
      {isLoading && <Spinner />}
      <Router>
        <Routes>
          <Route path="/" element={<CarList />} />
          <Route path="/auth" element={<Auth />} />

          {/* Protect these routes */}
          <Route
            path="/cars"
            element={
              <PrivateRoute>
                <CarList />
              </PrivateRoute>
            }
          />
          <Route
            path="/cars/add"
            element={
              <PrivateRoute>
                <AddCar />
              </PrivateRoute>
            }
          />
          <Route
            path="/cars/update/:id"
            element={
              <PrivateRoute>
                <UpdateCar />
              </PrivateRoute>
            }
          />
          <Route
            path="/cars/:id"
            element={
              <PrivateRoute>
                <CarDetail />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
