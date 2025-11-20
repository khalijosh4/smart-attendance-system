import React from 'react';
import { useNavigate } from 'react-router-dom';

const SessionExpiredModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLoginRedirect = () => {
    onClose();
    navigate('/login');
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Session Expired</h2>
        <p className="text-gray-700 mb-6">Your session has expired. Please log in again to continue.</p>
        <button
          onClick={handleLoginRedirect}
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition-colors font-bold"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default SessionExpiredModal;
