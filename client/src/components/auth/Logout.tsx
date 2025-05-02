import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from '@tanstack/react-router';

const Logout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate({ to: '/login' });
  };

  return (
    <button
      onClick={handleLogout}
      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
    >
      Logout
    </button>
  );
};

export default Logout; 