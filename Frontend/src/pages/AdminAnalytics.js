import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import { useTheme } from './ThemeContext';
import { FiTrendingUp, FiActivity, FiDollarSign, FiPieChart } from 'react-icons/fi';

const AdminAnalyticsPage = ({ role }) => {
  const { isDark, toggleTheme } = useTheme();
  const [ticketData, setTicketData] = useState([]);
  const [profit, setEarningsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch ticket analytics data from FastAPI
  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        const response = await fetch('https://online-chatbot-based-ticketing-system-4whh.onrender.com/tickets-analytics');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setTicketData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching ticket data:', error);
        setLoading(false);
      }
    };

    const fetchEarningsData = async () => {
      try {
        const response = await fetch('https://online-chatbot-based-ticketing-system-4whh.onrender.com/profit');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setEarningsData(data);
      } catch (error) {
        console.error('Error fetching earnings data:', error);
      }
    };

    fetchTicketData();
    fetchEarningsData();
  }, []);

  const chartStyles = {
    gridStroke: isDark ? '#374151' : '#E5E7EB',
    textColor: isDark ? '#9CA3AF' : '#6B7280',
    tooltipBg: isDark ? '#1F2937' : '#FFFFFF',
    tooltipBorder: isDark ? '#6C5CE7' : '#A29BFE'
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`rounded-lg shadow-xl border p-3 ${
          isDark ? 'bg-gray-800 border-purple-500/50' : 'bg-white border-purple-200'
        }`}>
          <p className={`font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
            {label}
          </p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: <span className="font-bold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-2">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Real-time performance metrics and business insights
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-purple-500/50 dark:from-purple-500 dark:to-pink-500"
            >
              {isDark ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { icon: FiTrendingUp, label: 'Total Tickets', value: ticketData.reduce((sum, item) => sum + (item.tickets || 0), 0), color: 'purple' },
            { icon: FiActivity, label: 'Avg Resolution', value: `${(ticketData.reduce((sum, item) => sum + (item.resolutionTime || 0), 0) / (ticketData.length || 1)).toFixed(1)}h`, color: 'green' },
            { icon: FiDollarSign, label: 'Total Profit', value: `$${profit.reduce((sum, item) => sum + (item.profit || 0), 0).toLocaleString()}`, color: 'blue' },
            { icon: FiPieChart, label: 'Total Earnings', value: `$${profit.reduce((sum, item) => sum + (item.earnings || 0), 0).toLocaleString()}`, color: 'pink' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-2xl ${
                isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              } shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ticket Performance Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`rounded-2xl p-6 shadow-lg ${
              isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}
          >
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <FiActivity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Ticket Performance
                </h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Ticket distribution and resolution times
              </p>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center h-80">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart
                  data={ticketData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="ticketsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6C5CE7" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6C5CE7" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="resolutionGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00B894" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00B894" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
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
                  <Area
                    type="monotone"
                    dataKey="tickets"
                    stroke="#6C5CE7"
                    strokeWidth={2}
                    fill="url(#ticketsGradient)"
                    name="Total Tickets"
                  />
                  <Area
                    type="monotone"
                    dataKey="resolutionTime"
                    stroke="#00B894"
                    strokeWidth={2}
                    fill="url(#resolutionGradient)"
                    name="Avg Resolution (hrs)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* Financial Overview Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`rounded-2xl p-6 shadow-lg ${
              isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
            }`}
          >
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <FiDollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Financial Overview
                </h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Earnings, costs, and profit analysis
              </p>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center h-80">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart
                  data={profit}
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
                    dataKey="earnings" 
                    fill="#6C5CE7" 
                    radius={[8, 8, 0, 0]} 
                    name="Earnings"
                  />
                  <Bar 
                    dataKey="cost" 
                    fill="#FF6B6B" 
                    radius={[8, 8, 0, 0]} 
                    name="Costs"
                  />
                  <Bar 
                    dataKey="profit" 
                    fill="#00B894" 
                    radius={[8, 8, 0, 0]} 
                    name="Profit"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
