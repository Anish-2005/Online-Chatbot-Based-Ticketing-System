import ThemeToggleButton from './ThemeToggleButton';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiHome, FiBarChart2, FiDollarSign, FiTag, FiSettings,
  FiChevronRight, FiCalendar, FiChevronLeft
} from 'react-icons/fi';
import { useTheme } from '../pages/ThemeContext';

const Sidebar = () => {
  const location = useLocation();
  const { isDark } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('adminSidebarCollapsed') === 'true';
  });

  useEffect(() => {
    const width = isCollapsed ? '5rem' : '16rem';
    document.documentElement.style.setProperty('--admin-sidebar-width', width);
    localStorage.setItem('adminSidebarCollapsed', String(isCollapsed));
  }, [isCollapsed]);

  const links = [
    { name: 'Dashboard', path: '/admindashboard', icon: FiHome },
    { name: 'Analytics', path: '/adminanalytics', icon: FiBarChart2 },
    { name: 'Manage Shows', path: '/adminshows', icon: FiCalendar },
    { name: 'Total Earnings', path: '/admintotalearning', icon: FiDollarSign },
    { name: 'Special Offers', path: '/adminSpecialOffers', icon: FiTag },
    { name: 'Settings', path: '/adminsettings', icon: FiSettings }
  ];

  return (
    <div className={`fixed inset-y-0 left-0 ${isCollapsed ? 'w-20' : 'w-64'} ${isDark
        ? 'bg-gray-900 border-r border-gray-800'
        : 'bg-white border-r border-gray-200'
      } shadow-2xl z-50 flex flex-col transition-all duration-300`}>

      {/* Logo/Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between gap-3'}`}
        >
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="w-10 h-10 rounded-xl bg-white/90 dark:bg-gray-800 flex items-center justify-center shadow-lg p-1">
              <img src="/chat-ticket-logo.svg" alt="ChatTicket logo" className="w-full h-full rounded-lg" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="text-xl font-heading font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent leading-tight tracking-tight">
                  ChatTicket
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Admin Panel</p>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              type="button"
              onClick={() => setIsCollapsed(true)}
              className={`rounded-lg p-2 transition-all ${isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
              aria-label="Collapse sidebar"
            >
              <FiChevronLeft className="h-4 w-4" />
            </button>
          )}
        </motion.div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {links.map((link, index) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;

          return (
            <motion.div
              key={link.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <Link
                to={link.path}
                className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                    : isDark
                      ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  } ${isCollapsed ? 'justify-center px-2' : ''}`}
              >
                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 w-1 h-8 bg-white rounded-r-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                <Icon className={`w-5 h-5 ${isActive
                    ? 'text-white'
                    : 'group-hover:scale-110 transition-transform'
                  }`} />

                {!isCollapsed && (
                  <span className="font-heading font-semibold flex-1 tracking-tight">
                    {link.name}
                  </span>
                )}

                {!isCollapsed && (
                  <FiChevronRight className={`w-4 h-4 transform transition-all ${isActive
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
                    }`} />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Return to Home Button */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <ThemeToggleButton isCollapsed={isCollapsed} />
        {isCollapsed && (
          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            className={`mb-3 flex w-full items-center justify-center rounded-xl p-2 transition-all ${isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            aria-label="Expand sidebar"
          >
            <FiChevronRight className="h-4 w-4" />
          </button>
        )}

        <Link
          to="/"
          className={`flex items-center justify-center ${isCollapsed ? '' : 'gap-2'} py-3 px-4 rounded-xl font-heading font-semibold transition-all duration-300 text-base tracking-tight ${isDark
              ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          <FiHome className="w-4 h-4" />
          {!isCollapsed && 'Return to Home'}
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
