import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import { useTheme } from './ThemeContext';
import { 
  FiUsers, FiDollarSign, FiTrendingUp, FiCalendar,
  FiActivity, FiBarChart2, FiClock, FiCheckCircle
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = ({ role }) => {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Mock data - replace with actual API calls
  const stats = [
    { 
      id: 1, 
      title: 'Total Revenue', 
      value: '$45,231', 
      change: '+12.5%', 
      icon: FiDollarSign,
      gradient: 'from-emerald-500 to-teal-600',
      bgLight: 'bg-emerald-50',
      bgDark: 'bg-emerald-900/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400'
    },
    { 
      id: 2, 
      title: 'Active Users', 
      value: '2,847', 
      change: '+8.2%', 
      icon: FiUsers,
      gradient: 'from-blue-500 to-indigo-600',
      bgLight: 'bg-blue-50',
      bgDark: 'bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    { 
      id: 3, 
      title: 'Bookings Today', 
      value: '156', 
      change: '+23.1%', 
      icon: FiCalendar,
      gradient: 'from-purple-500 to-pink-600',
      bgLight: 'bg-purple-50',
      bgDark: 'bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400'
    },
    { 
      id: 4, 
      title: 'Conversion Rate', 
      value: '68.4%', 
      change: '+5.3%', 
      icon: FiTrendingUp,
      gradient: 'from-orange-500 to-red-600',
      bgLight: 'bg-orange-50',
      bgDark: 'bg-orange-900/20',
      iconColor: 'text-orange-600 dark:text-orange-400'
    },
  ];

  const quickActions = [
    { title: 'View Analytics', icon: FiBarChart2, path: '/adminanalytics', color: 'purple' },
    { title: 'Manage Shows', icon: FiCalendar, path: '/adminshows', color: 'indigo' },
    { title: 'Total Earnings', icon: FiDollarSign, path: '/admintotalearning', color: 'green' },
    { title: 'Manage Users', icon: FiUsers, path: '/adminusers', color: 'blue' },
    { title: 'Settings', icon: FiActivity, path: '/adminsettings', color: 'gray' },
  ];

  const recentActivity = [
    { id: 1, action: 'New booking received', user: 'John Doe', time: '2 minutes ago', status: 'success' },
    { id: 2, action: 'Payment processed', user: 'Jane Smith', time: '15 minutes ago', status: 'success' },
    { id: 3, action: 'User registered', user: 'Mike Johnson', time: '1 hour ago', status: 'info' },
    { id: 4, action: 'Booking cancelled', user: 'Sarah Williams', time: '2 hours ago', status: 'warning' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className={`flex min-h-screen ${isDark ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Sidebar role={role} />

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-2">
            <div>
              <h1 className="text-5xl font-heading font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent leading-tight tracking-tight mb-2">
                Admin Dashboard
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 font-medium leading-relaxed max-w-3xl">
                Welcome back! Here's what's happening with your platform today.
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="group relative px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-purple-500/50 dark:from-purple-500 dark:to-pink-500 text-base"
            >
              <span className="flex items-center gap-2 font-medium">
                {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
              </span>
            </button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.id}
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className={`relative overflow-hidden rounded-2xl shadow-lg ${
                  isDark 
                    ? 'bg-gray-800 border border-gray-700' 
                    : 'bg-white border border-gray-100'
                } p-6 transition-all duration-300 hover:shadow-2xl`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${isDark ? stat.bgDark : stat.bgLight}`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                  <span className={`text-xs font-heading font-bold px-3 py-1 rounded-full tracking-wide ${
                    stat.change.startsWith('+') 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-gray-600 dark:text-gray-400 text-xs font-semibold mb-2 tracking-wide uppercase">
                  {stat.title}
                </h3>
                <p className="text-4xl font-heading font-bold text-gray-900 dark:text-white leading-tight">
                  {stat.value}
                </p>
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient}`} />
              </motion.div>
            );
          })}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className={`lg:col-span-1 rounded-2xl shadow-lg p-6 ${
              isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
            }`}
          >
            <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3 tracking-tight">
              <FiActivity className="text-purple-600 dark:text-purple-400 w-6 h-6" />
              Quick Actions
            </h2>
            <div className="space-y-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(action.path)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                      isDark 
                        ? 'bg-gray-700/50 hover:bg-gray-700 border border-gray-600' 
                        : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <div className={`p-2 rounded-lg bg-${action.color}-100 dark:bg-${action.color}-900/30`}>
                      <Icon className={`w-5 h-5 text-${action.color}-600 dark:text-${action.color}-400`} />
                    </div>
                    <span className="font-heading font-semibold text-gray-900 dark:text-white text-base">
                      {action.title}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className={`lg:col-span-2 rounded-2xl shadow-lg p-6 ${
              isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
            }`}
          >
            <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3 tracking-tight">
              <FiClock className="text-purple-600 dark:text-purple-400 w-6 h-6" />
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                    isDark 
                      ? 'bg-gray-700/30 hover:bg-gray-700/50' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className={`p-2 rounded-full ${
                    activity.status === 'success' 
                      ? 'bg-green-100 dark:bg-green-900/30' 
                      : activity.status === 'warning'
                      ? 'bg-orange-100 dark:bg-orange-900/30'
                      : 'bg-blue-100 dark:bg-blue-900/30'
                  }`}>
                    <FiCheckCircle className={`w-4 h-4 ${
                      activity.status === 'success' 
                        ? 'text-green-600 dark:text-green-400' 
                        : activity.status === 'warning'
                        ? 'text-orange-600 dark:text-orange-400'
                        : 'text-blue-600 dark:text-blue-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-heading font-semibold text-gray-900 dark:text-white text-base">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {activity.user}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {activity.time}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
