import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome } from 'react-icons/fa'; // Import home icon
import { useTheme } from './ThemeContext';

const UserSidebar = () => {
  const location = useLocation(); // Get the current location
  const { isDark } = useTheme(); // Get theme from context

  const links = [
    { name: 'BookShows', path: '/bookshows'},
    { name: 'Events', path: '/events' }
    
  ];

  return (
    <div className={`fixed inset-y-0 left-0 w-64 flex flex-col p-6 shadow-lg ${
      isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900 border-r border-gray-200'
    }`}>
      <motion.h2
        className={`text-3xl font-bold mb-10 ${isDark ? 'text-purple-300' : 'text-blue-900'}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        User Dashboard
      </motion.h2>
      <nav>
        <ul>
          {links.map((link, index) => (
            <motion.li
              key={link.name}
              className={`mb-6 ${
                location.pathname === link.path 
                  ? `${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-900'}` 
                  : ''
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4, ease: 'easeOut' }}
            >
              <Link
                to={link.path}
                className={`block text-lg px-4 py-2 rounded ${
                  location.pathname === link.path 
                    ? 'font-bold' 
                    : `${isDark ? 'hover:text-gray-300' : 'hover:text-gray-600'}`
                } transition-colors duration-300 ease-in-out`}
              >
                {link.name}
              </Link>
            </motion.li>
          ))}
        </ul>
      </nav>

      {/* Return to Home Button */}
      <div className="mt-auto">
        <Link
          to="/home"
          className={`flex items-center justify-center py-2 px-4 rounded-lg shadow-md transition-colors duration-300 ease-in-out text-sm ${
            isDark 
              ? 'bg-gray-800 text-white hover:bg-gray-700' 
              : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
          }`}
        >
          <FaHome className="mr-2" /> {/* Home icon */}
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default UserSidebar;
