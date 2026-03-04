import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import { useTheme } from './ThemeContext';
import {
  FiUsers,
  FiDollarSign,
  FiTrendingUp,
  FiCalendar,
  FiActivity,
  FiBarChart2,
  FiClock,
  FiCheckCircle,
  FiRefreshCw,
  FiArrowUpRight,
  FiLayers,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { fetchAdminDashboardData } from '../services/dashboard';

const formatCurrency = (value) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
}).format(Number(value || 0));

const formatRelativeTime = (dateValue) => {
  if (!dateValue) return 'Time unavailable';

  const timeMs = typeof dateValue === 'number' ? dateValue : new Date(dateValue).getTime();
  const diffMs = Date.now() - timeMs;
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;

  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
};

const AdminDashboard = ({ role }) => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError('');
    try {
      // Race the fetch against a 15-second timeout so the UI never hangs
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Dashboard request timed out. The backend may be slow or unreachable.')), 15000)
      );
      const data = await Promise.race([fetchAdminDashboardData(), timeout]);
      setDashboardData(data);
    } catch (loadError) {
      console.error('Error loading admin dashboard:', loadError);
      setError(loadError.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard(false);
  }, [loadDashboard]);

  const quickActions = useMemo(() => [
    { title: 'View Analytics', icon: FiBarChart2, path: '/adminanalytics', color: 'indigo' },
    { title: 'Manage Shows', icon: FiCalendar, path: '/adminshows', color: 'indigo' },
    { title: 'Total Earnings', icon: FiDollarSign, path: '/admintotalearning', color: 'green' },
    { title: 'Manage Users', icon: FiUsers, path: '/adminusers', color: 'blue' },
    { title: 'Settings', icon: FiActivity, path: '/adminsettings', color: 'gray' },
  ], []);

  const actionColorClasses = {
    indigo: isDark ? 'bg-indigo-900/30 text-indigo-300' : 'bg-indigo-100 text-indigo-700',
    indigo: isDark ? 'bg-indigo-900/30 text-indigo-300' : 'bg-indigo-100 text-indigo-700',
    green: isDark ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700',
    blue: isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700',
    gray: isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700',
  };

  const kpis = useMemo(() => dashboardData?.kpis || {
    totalRevenue: 0,
    activeUsers: 0,
    bookingsToday: 0,
    conversionRate: 0,
    totalTicketsSold: 0,
    totalShows: 0,
    todayRevenue: 0,
    upcomingShows: 0,
  }, [dashboardData?.kpis]);

  const stats = useMemo(() => [
    {
      id: 1,
      title: 'Total Revenue',
      value: formatCurrency(kpis.totalRevenue),
      helper: `Today ${formatCurrency(kpis.todayRevenue)}`,
      icon: FiDollarSign,
      gradient: 'from-emerald-500 to-teal-600',
      bgLight: 'bg-emerald-50',
      bgDark: 'bg-emerald-900/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      id: 2,
      title: 'Active Users',
      value: kpis.activeUsers.toLocaleString(),
      helper: `${kpis.totalShows} total live shows`,
      icon: FiUsers,
      gradient: 'from-blue-500 to-indigo-600',
      bgLight: 'bg-blue-50',
      bgDark: 'bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      id: 3,
      title: 'Bookings Today',
      value: kpis.bookingsToday.toLocaleString(),
      helper: `${kpis.totalTicketsSold.toLocaleString()} tickets sold total`,
      icon: FiCalendar,
      gradient: 'from-indigo-500 to-blue-600',
      bgLight: 'bg-indigo-50',
      bgDark: 'bg-indigo-900/20',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
    },
    {
      id: 4,
      title: 'Fill Rate',
      value: `${Number(kpis.conversionRate || 0).toFixed(1)}%`,
      helper: `${kpis.upcomingShows} upcoming show${kpis.upcomingShows === 1 ? '' : 's'}`,
      icon: FiTrendingUp,
      gradient: 'from-orange-500 to-red-600',
      bgLight: 'bg-orange-50',
      bgDark: 'bg-orange-900/20',
      iconColor: 'text-orange-600 dark:text-orange-400',
    },
  ], [kpis]);

  const topShows = dashboardData?.topShows || [];
  const recentActivity = dashboardData?.recentActivity || [];

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
      <div className="flex-1 p-8 transition-all duration-300" style={{ marginLeft: 'var(--admin-sidebar-width, 16rem)' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-2">
            <div>
              <h1 className="text-5xl font-heading font-bold bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400 bg-clip-text text-transparent leading-tight tracking-tight mb-2">
                Admin Dashboard
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 font-medium leading-relaxed max-w-3xl">
                Live operational metrics from your bookings, shows, and payment activity.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => loadDashboard(true)}
                disabled={refreshing || loading}
                className={`group relative px-5 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 text-base ${isDark ? 'bg-gray-800 text-gray-100 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'} disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                <span className="flex items-center gap-2 font-medium">
                  <FiRefreshCw className={`${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </span>
              </button>
            </div>
          </div>
        </motion.div>

        {error ? (
          <div className={`mb-6 rounded-xl border px-4 py-3 text-sm font-medium ${isDark ? 'border-red-500/40 bg-red-900/25 text-red-200' : 'border-red-200 bg-red-50 text-red-700'}`}>
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className={`mb-8 rounded-2xl p-10 text-center shadow-lg ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}>
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600" />
            <p className={`mt-4 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Loading real-time dashboard data...
            </p>
          </div>
        ) : (
          <>

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
                    className={`relative overflow-hidden rounded-2xl shadow-lg ${isDark
                      ? 'bg-gray-800 border border-gray-700'
                      : 'bg-white border border-gray-100'
                      } p-6 transition-all duration-300 hover:shadow-2xl`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl ${isDark ? stat.bgDark : stat.bgLight}`}>
                        <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                      </div>
                      <span className={`text-xs font-heading font-bold px-3 py-1 rounded-full tracking-wide ${isDark ? 'bg-indigo-900/30 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}`}>
                        Live
                      </span>
                    </div>
                    <h3 className="text-gray-600 dark:text-gray-400 text-xs font-semibold mb-2 tracking-wide uppercase">
                      {stat.title}
                    </h3>
                    <p className="text-4xl font-heading font-bold text-gray-900 dark:text-white leading-tight">
                      {stat.value}
                    </p>
                    <p className={`mt-2 text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {stat.helper}
                    </p>
                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient}`} />
                  </motion.div>
                );
              })}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className={`lg:col-span-1 rounded-2xl shadow-lg p-6 ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
                  }`}
              >
                <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3 tracking-tight">
                  <FiActivity className="text-indigo-600 dark:text-indigo-400 w-6 h-6" />
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
                        className={`w-full flex items-center justify-between gap-4 p-4 rounded-xl transition-all duration-300 ${isDark
                          ? 'bg-gray-700/50 hover:bg-gray-700 border border-gray-600'
                          : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${actionColorClasses[action.color]}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="font-heading font-semibold text-gray-900 dark:text-white text-base">
                            {action.title}
                          </span>
                        </div>
                        <FiArrowUpRight className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className={`lg:col-span-2 rounded-2xl shadow-lg p-6 ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
                  }`}
              >
                <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3 tracking-tight">
                  <FiClock className="text-indigo-600 dark:text-indigo-400 w-6 h-6" />
                  Recent Activity
                </h2>
                {recentActivity.length === 0 ? (
                  <div className={`rounded-xl border px-4 py-6 text-center text-sm ${isDark ? 'border-gray-700 bg-gray-900/30 text-gray-300' : 'border-gray-200 bg-gray-50 text-gray-600'}`}>
                    No recent activity found yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.08 }}
                        className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-300 ${isDark
                          ? 'bg-gray-700/30 hover:bg-gray-700/50'
                          : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                      >
                        <div className={`mt-0.5 p-2 rounded-full ${activity.status === 'success'
                          ? 'bg-green-100 dark:bg-green-900/30'
                          : 'bg-blue-100 dark:bg-blue-900/30'
                          }`}>
                          <FiCheckCircle className={`w-4 h-4 ${activity.status === 'success'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-blue-600 dark:text-blue-400'
                            }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-heading font-semibold text-gray-900 dark:text-white text-base">
                            {activity.action}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-0.5 truncate">
                            {activity.user}
                          </p>
                          <p className={`text-sm mt-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            {activity.details}
                            {typeof activity.amount === 'number' && activity.amount > 0 ? ` • ${formatCurrency(activity.amount)}` : ''}
                          </p>
                        </div>
                        <span className="shrink-0 text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
                          {formatRelativeTime(activity.timestamp)}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className={`mt-8 rounded-2xl shadow-lg p-6 ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}
            >
              <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3 tracking-tight">
                <FiLayers className="text-indigo-600 dark:text-indigo-400 w-6 h-6" />
                Top Performing Shows
              </h2>

              {topShows.length === 0 ? (
                <div className={`rounded-xl border px-4 py-6 text-center text-sm ${isDark ? 'border-gray-700 bg-gray-900/30 text-gray-300' : 'border-gray-200 bg-gray-50 text-gray-600'}`}>
                  No show performance data available.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left">
                    <thead>
                      <tr className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        <th className="px-4 py-3 text-xs uppercase tracking-wider">Show</th>
                        <th className="px-4 py-3 text-xs uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-xs uppercase tracking-wider">Sold</th>
                        <th className="px-4 py-3 text-xs uppercase tracking-wider">Left</th>
                        <th className="px-4 py-3 text-xs uppercase tracking-wider">Fill %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topShows.map((show) => (
                        <tr key={show.id} className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                          <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{show.title}</td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{show.date}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{show.soldSeats}/{show.totalSeats}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{show.ticketsLeft}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${Number(show.occupancyRate) >= 70
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                              : Number(show.occupancyRate) >= 40
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                              }`}>
                              {Number(show.occupancyRate).toFixed(1)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
