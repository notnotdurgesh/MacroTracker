import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, IconButton } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
function Header({ setIsAuthenticated, isAuthenticated, toggleDarkMode, darkMode, handleNotification }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    handleNotification('Logged out successfully', 'success');
    navigate('/login');
  };

  return (
    <header className="p-4 flex justify-between items-center">
      <h1 className="text-xl">Macro's Tracker</h1>
      {isAuthenticated && location.pathname !== '/login' && location.pathname !== '/signup' && (
        <Button
          variant="contained"
          color="secondary"
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </Button>
      )}
      <IconButton onClick={toggleDarkMode} className="text-gray-800 dark:text-gray-200">
        {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </header>
  );
}

export { Header };
