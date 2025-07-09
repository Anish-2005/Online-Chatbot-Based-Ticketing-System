import React, { useState, useEffect } from 'react';
import UserSidebar from '../components/UserSidebar'; // Ensure the correct path
import { motion } from 'framer-motion';

const UserDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Handle dark mode toggle
  const handleToggle = () => {
    setDarkMode(!darkMode);
  };

  // Add or remove dark class on the body based on darkMode state
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`flex min-h-screen ${darkMode ? 'dark' : 'light'}`}>
      {/* User Sidebar */}
      <UserSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64 p-10" id="white">
        <motion.div
          className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Toggle Button */}
          <div className="absolute top-4 right-4">
            <button
              onClick={handleToggle}
              className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-full px-4 py-2 shadow-md"
            >
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>

          <motion.h1
            className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            Welcome to Your Dashboard
          </motion.h1>

          <motion.p
            className="text-lg text-gray-700 dark:text-gray-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            Your one place to track all your ticketing details. Explore your booking manual and upcoming events.
          </motion.p>

          {/* Additional content goes here */}
        </motion.div>
      </div>
    </div>
  );
};

export default UserDashboard;
