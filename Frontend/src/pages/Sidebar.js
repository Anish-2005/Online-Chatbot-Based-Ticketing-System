import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const location = useLocation(); // Get the current location

  const links = [
    { name: 'Admin Analytics', path: '/adminanalytics' },
    { name: 'Users', path: '/adminusers' },
    { name: 'Total Earnings', path: '/admintotalearning' },
    { name: 'Special Offers', path: '/adminSpecialOffers' },
    { name: 'Settings', path: '/adminsettings' }
  ];

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white flex flex-col p-6 shadow-lg">
      <motion.h2
        className="text-3xl font-bold mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        Admin Dashboard
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
    </div>
  );
};

export default Sidebar;
