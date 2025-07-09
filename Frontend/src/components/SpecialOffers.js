import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar'; // Ensure Sidebar is correctly imported
import './SpecialOffers.css'; // Import your CSS file for dark mode styles

const SpecialOffers = ({ role }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    document.body.classList.toggle('dark-mode', newDarkMode);
  };

  const offers = [
    { id: 1, title: '10% off on annual subscription', validUntil: '2024-12-31' },
    { id: 2, title: 'Buy one get one free', validUntil: '2024-11-15' },
  ];

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'dark-mode' : 'bg-gray-100'}`}>
      {/* Sidebar */}
      <Sidebar role={role} />

      {/* Main Content */}
      <div className="flex-1 ml-64 p-10">
        <motion.div
          className={`shadow-xl rounded-lg p-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Special Offers & Promotions
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

          <motion.ul
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } }
            }}
          >
            {offers.map((offer) => (
              <motion.li
                key={offer.id}
                className={`mb-6 p-4 rounded-lg shadow-lg ${isDarkMode ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600' : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-white'}`}>
                  {offer.title}
                </h3>
                <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-200'}`}>
                  Valid until: {offer.validUntil}
                </p>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </div>
  );
};

export default SpecialOffers;
