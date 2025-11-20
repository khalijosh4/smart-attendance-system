import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';

import Departments from './pages/Departments';
import DepartmentDetails from './pages/DepartmentDetails';
import Settings from './pages/Settings';

import UserDashboard from './pages/UserDashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SessionExpiredModal from './components/SessionExpiredModal';

// Inner component to use useNavigate
const AppContent = () => {
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          // Check if it's not the login page itself to avoid loops if login fails with 401
          if (!window.location.pathname.includes('/login')) {
             localStorage.removeItem('token');
             setIsSessionExpired(true);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const handleCloseModal = () => {
    setIsSessionExpired(false);
    navigate('/login');
  };

  return (
    <>
      <SessionExpiredModal isOpen={isSessionExpired} onClose={handleCloseModal} />
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="employees" element={<Employees />} />
          <Route path="employees/:id" element={<UserDashboard />} />
          <Route path="departments" element={<Departments />} />
          <Route path="departments/:id" element={<DepartmentDetails />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
