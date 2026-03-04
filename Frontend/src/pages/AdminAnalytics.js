import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import { useTheme } from './ThemeContext';
import { FiTrendingUp, FiActivity, FiDollarSign, FiPieChart } from 'react-icons/fi';
import { fetchAdminAnalyticsData } from '../services/dashboard';

const formatCurrency = (value) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
}).format(Number(value || 0));

const AdminAnalyticsPage = ({ role }) => {
  const { isDark } = useTheme();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchAdminAnalyticsData();
        setAnalyticsData(data);
      } catch (error) {
        console.error('Error loading analytics data:', error);
        setError(error.message || 'Unable to load analytics right now.');
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const chartStyles = {
    gridStroke: isDark ? '#374151' : '#E5E7EB',
    textColor: isDark ? '#9CA3AF' : '#6B7280',
    tooltipBg: isDark ? '#1F2937' : '#FFFFFF',
    tooltipBorder: isDark ? '#6C5CE7' : '#A29BFE',
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`rounded-lg shadow-xl border p-3 ${isDark ? 'bg-gray-800 border-violet-500/50' : 'bg-white border-violet-200'
          }`}>
          <p className={`font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
            {label}
          </p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: <span className="font-bold">{entry.dataKey === 'revenue' || entry.dataKey === 'earnings' ? formatCurrency(entry.value) : entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const stats = useMemo(() => {
    const kpis = analyticsData?.kpis;
    if (!kpis) {
      return [
        { icon: FiTrendingUp, label: 'Total Tickets', value: '0' },
        { icon: FiActivity, label: 'Bookings (7d)', value: '0' },
        { icon: FiDollarSign, label: 'Total Revenue', value: formatCurrency(0) },
        { icon: FiPieChart, label: 'Fill Rate', value: '0%' },
      ];
    }

    const bookings7d = (analyticsData?.bookingTrend || []).reduce((sum, item) => sum + (item.bookings || 0), 0);

    return [
      { icon: FiTrendingUp, label: 'Total Tickets', value: kpis.totalTicketsSold.toLocaleString() },
      { icon: FiActivity, label: 'Bookings (7d)', value: bookings7d.toLocaleString() },
      { icon: FiDollarSign, label: 'Total Revenue', value: formatCurrency(kpis.totalRevenue) },
      { icon: FiPieChart, label: 'Fill Rate', value: `${Number(kpis.conversionRate || 0).toFixed(1)}%` },
    ];
  }, [analyticsData]);

  return (
    <div className={`flex min-h-screen ${isDark ? 'dark bg-slate-950' : 'bg-slate-50'} bg-mesh selection:bg-indigo-500/30`}>
      <Sidebar role={role} />

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 lg:p-10 transition-all duration-300 overflow-x-hidden min-w-0" style={{ marginLeft: 'var(--admin-sidebar-width, 0rem)' }}>
        {/* Mobile Spacer */}
        <div className="h-20 lg:hidden" />
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-5xl font-heading font-bold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2 leading-tight tracking-tight">
                Analytics Dashboard
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                Real-time performance metrics and business insights
              </p>
            </div>
            <div />
          </div>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-2xl ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                } shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${isDark ? 'bg-violet-900/20 text-violet-300' : 'bg-violet-100 text-violet-700'}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wide">{stat.label}</p>
              <p className="text-3xl font-heading font-bold text-gray-900 dark:text-white leading-tight">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`rounded-2xl p-6 shadow-lg ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}
          >
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <FiActivity className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white tracking-tight">
                  Booking Trend (Last 7 Days)
                </h2>
              </div>
              <p className="text-base text-gray-600 dark:text-gray-400 font-medium">
                Daily bookings, tickets sold and revenue
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-80">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
              </div>
            ) : error ? (
              <div className={`rounded-xl border px-4 py-6 text-sm ${isDark ? 'border-red-500/30 bg-red-900/20 text-red-200' : 'border-red-200 bg-red-50 text-red-700'}`}>
                {error}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <LineChart
                  data={analyticsData?.bookingTrend || []}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={chartStyles.gridStroke}
                    opacity={0.5}
                  />
                  <XAxis
                    dataKey="name"
                    stroke={chartStyles.textColor}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    stroke={chartStyles.textColor}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: '10px' }}
                    iconType="line"
                  />
                  <Line
                    type="monotone"
                    dataKey="bookings"
                    stroke="#6C5CE7"
                    strokeWidth={2}
                    name="Bookings"
                  />
                  <Line
                    type="monotone"
                    dataKey="tickets"
                    stroke="#00B894"
                    strokeWidth={2}
                    name="Tickets"
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#F97316"
                    strokeWidth={2}
                    name="Revenue"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* Show Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`rounded-2xl p-6 shadow-lg ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}
          >
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <FiDollarSign className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white tracking-tight">
                  Show Performance
                </h2>
              </div>
              <p className="text-base text-gray-600 dark:text-gray-400 font-medium">
                Top shows by seats sold and occupancy
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-80">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
              </div>
            ) : error ? (
              <div className={`rounded-xl border px-4 py-6 text-sm ${isDark ? 'border-red-500/30 bg-red-900/20 text-red-200' : 'border-red-200 bg-red-50 text-red-700'}`}>
                {error}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart
                  data={analyticsData?.showPerformance || []}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={chartStyles.gridStroke}
                    opacity={0.5}
                  />
                  <XAxis
                    dataKey="name"
                    stroke={chartStyles.textColor}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    stroke={chartStyles.textColor}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: '10px' }} />
                  <Bar
                    dataKey="sold"
                    fill="#6C5CE7"
                    radius={[8, 8, 0, 0]}
                    name="Sold"
                  />
                  <Bar
                    dataKey="left"
                    fill="#64748B"
                    radius={[8, 8, 0, 0]}
                    name="Left"
                  />
                  <Bar
                    dataKey="occupancy"
                    fill="#00B894"
                    radius={[8, 8, 0, 0]}
                    name="Occupancy %"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className={`mt-8 rounded-2xl p-6 shadow-lg ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}
        >
          <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white tracking-tight mb-4">
            Financial Breakdown by Show
          </h2>
          {(analyticsData?.financialBreakdown || []).length === 0 ? (
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              No financial entries available yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <th className="px-4 py-3 text-xs uppercase tracking-wider">Show</th>
                    <th className="px-4 py-3 text-xs uppercase tracking-wider">Bookings</th>
                    <th className="px-4 py-3 text-xs uppercase tracking-wider">Tickets</th>
                    <th className="px-4 py-3 text-xs uppercase tracking-wider">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.financialBreakdown.map((row) => (
                    <tr key={row.name} className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                      <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{row.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{row.bookings}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{row.tickets}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(row.earnings)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
