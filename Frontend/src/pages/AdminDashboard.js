import React from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import { useTheme } from './ThemeContext';
import './AdminDashboard.css'; // Import your CSS file if needed

const AdminDashboard = ({ role }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className={`flex min-h-screen ${isDark ? 'dark' : ''}`}>
      {/* Sidebar */}
      <Sidebar role={role} />

      {/* Main Content */}
      <div className={`flex-1 ml-64 p-8 ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <motion.div
          className={`bg-gradient-to-r ${isDark ? 'from-gray-700 via-gray-800 to-gray-900' : 'from-purple-600 via-purple-500 to-purple-400'} text-white shadow-xl rounded-lg p-8 mb-8`}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="flex justify-between items-center mb-6">
            <motion.h1
              className="text-4xl font-extrabold"
              style={{ color: 'white' }} 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              Welcome to Admin Dashboard
            </motion.h1>
            <button
              onClick={toggleTheme}
              className={`py-2 px-4 rounded-lg font-semibold shadow-md transition-all duration-300 ease-in-out ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-purple-600 hover:bg-gray-100'}`}
            >
              {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>

          <motion.p
            className="text-lg font-medium"
            style={{ color: 'white' }} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            Your one place to track all your ticketing details and manage your operations seamlessly.
          </motion.p>
        </motion.div>
        
        {/* Additional content can be added here */}
      </div>
    </div>
  );
};

export default AdminDashboard;
