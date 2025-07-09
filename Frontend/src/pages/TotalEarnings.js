import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';
import './TotalEarnings.css'; // Import your CSS file for TotalEarningsPage

const TotalEarningsPage = ({ role }) => {
  const [earningsBreakdown, setEarningsBreakdown] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Fetch earnings from FastAPI
  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const response = await fetch('https://fastapi-deploy-app.onrender.com/earning');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        // Set the first item of the array as the earnings breakdown
        setEarningsBreakdown(data[0] || {}); // Default to an empty object if no data
      } catch (error) {
        console.error('Error fetching earnings data:', error);
      }
    };

    fetchEarnings();
  }, []);

  // Calculate total earnings
  const totalEarnings = Object.values(earningsBreakdown).reduce(
    (acc, value) => acc + value,
    0
  );

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    document.body.classList.toggle('dark-mode', newDarkMode);
  };

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'dark-mode' : ''}`}>
      <Sidebar role={role} />

      {/* Main Content */}
      <div className="flex-1 ml-64 p-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 shadow-2xl rounded-xl p-8 mb-8 ${isDarkMode ? 'bg-dark-gradient' : ''}`}
        >
          <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-light-purple mb-6">
            Total Earnings
          </h2>
            <button
              onClick={toggleDarkMode}
              className={`py-2 px-4 rounded-lg font-semibold shadow-md transition-all duration-300 ease-in-out ${
                isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className={`text-4xl font-extrabold mb-4 ${isDarkMode ? 'text-light-purple' : 'text-white'}`}
          >
            ${totalEarnings.toLocaleString()}
          </motion.p>

          <div className="space-y-4">
            {Object.entries(earningsBreakdown).map(([key, value], index) => (
              <motion.div
                key={key}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.2,
                  ease: 'easeOut',
                }}
                className={`flex justify-between items-center rounded-lg p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-white'} ${isDarkMode ? 'bg-opacity-30' : 'bg-opacity-10'}`}
              >
                <p className={`text-lg font-medium ${isDarkMode ? 'text-light-purple' : 'text-white'} capitalize`}>
                  {key.replace(/([A-Z])/g, ' $1')} {/* Formats camelCase */}
                </p>
                <p className={`text-lg font-semibold ${isDarkMode ? 'text-light-purple' : 'text-white'}`}>
                  ${value.toLocaleString()}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TotalEarningsPage;
