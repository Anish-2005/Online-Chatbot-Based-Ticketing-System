import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome } from 'react-icons/fa'; // Import home icon

const UserSidebar = () => {
  const location = useLocation(); // Get the current location

  const links = [
    { name: 'BookShows', path: '/bookshows'},
    { name: 'Events', path: '/events' }
    
  ];

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white flex flex-col p-6 shadow-lg">
      <motion.h2
        className="text-3xl font-bold mb-10"
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
                location.pathname === link.path ? 'bg-gray-800 text-gray-300' : ''
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4, ease: 'easeOut' }}
            >
              <Link
                to={link.path}
                className={`block text-lg px-4 py-2 rounded ${
                  location.pathname === link.path ? 'font-bold' : 'hover:text-gray-300'
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
          className="flex items-center justify-center bg-gray-800 text-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-700 transition-colors duration-300 ease-in-out text-sm"
        >
          <FaHome className="mr-2" /> {/* Home icon */}
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default UserSidebar;
