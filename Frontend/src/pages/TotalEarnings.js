import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeContext';
import { FiDollarSign, FiTrendingUp, FiPieChart, FiCreditCard } from 'react-icons/fi';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { fetchTotalEarningsData } from '../services/dashboard';

const formatCurrency = (value) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
}).format(Number(value || 0));

const colorSets = [
  { bg: 'bg-purple-100 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400', chip: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300', fill: '#7C3AED' },
  { bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', chip: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', fill: '#2563EB' },
  { bg: 'bg-emerald-100 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400', chip: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300', fill: '#10B981' },
  { bg: 'bg-pink-100 dark:bg-pink-900/20', text: 'text-pink-600 dark:text-pink-400', chip: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300', fill: '#DB2777' },
  { bg: 'bg-orange-100 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400', chip: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300', fill: '#EA580C' },
  { bg: 'bg-indigo-100 dark:bg-indigo-900/20', text: 'text-indigo-600 dark:text-indigo-400', chip: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300', fill: '#4F46E5' },
];

const TotalEarningsPage = ({ role }) => {
  const { isDark } = useTheme();
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadEarnings = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchTotalEarningsData();
        setSummary(data.summary);
        setCategories(data.categories || []);
        setMonthlyRevenue(data.monthlyRevenue || []);
      } catch (error) {
        console.error('Error fetching earnings data:', error);
        setError(error.message || 'Unable to load earnings right now.');
      } finally {
        setLoading(false);
      }
    };

    loadEarnings();
  }, []);

  const totalEarnings = summary?.totalRevenue || 0;

  const getCategoryIcon = (index) => {
    const icons = [FiDollarSign, FiCreditCard, FiPieChart, FiTrendingUp];
    return icons[index % icons.length];
  };

  return (
    <div className={`flex min-h-screen ${isDark ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Sidebar role={role} />

      <div className="flex-1 p-8 transition-all duration-300" style={{ marginLeft: 'var(--admin-sidebar-width, 16rem)' }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-5xl font-heading font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent mb-2 leading-tight tracking-tight">
                Total Earnings
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                Comprehensive breakdown of all revenue streams
              </p>
            </div>
            <div />
          </div>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className={`rounded-2xl p-8 mb-8 shadow-xl relative overflow-hidden ${
                isDark 
                  ? 'bg-gradient-to-br from-emerald-900 to-teal-900 border border-emerald-700' 
                  : 'bg-gradient-to-br from-emerald-500 to-teal-600'
              }`}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w- h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <FiDollarSign className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm font-heading font-medium tracking-wide">Total Revenue</p>
                    <p className="text-5xl font-heading font-bold text-white leading-tight tracking-tight">
                      {formatCurrency(totalEarnings)}
                    </p>
                  </div>
                </div>
                <p className="text-white/70 text-base font-medium">
                  {summary?.totalBookings || 0} total bookings • {summary?.totalTickets || 0} tickets sold • Avg order {formatCurrency(summary?.averageOrderValue || 0)}
                </p>
              </div>
            </motion.div>

            {error ? (
              <div className={`mb-6 rounded-xl border px-4 py-3 text-sm font-medium ${isDark ? 'border-red-500/30 bg-red-900/20 text-red-200' : 'border-red-200 bg-red-50 text-red-700'}`}>
                {error}
              </div>
            ) : null}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
                Revenue by Show
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((item, index) => {
                  const Icon = getCategoryIcon(index);
                  const palette = colorSets[index % colorSets.length];
                  const percentage = totalEarnings > 0 ? ((item.value / totalEarnings) * 100).toFixed(1) : '0.0';
                  
                  return (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      className={`rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl ${
                        isDark 
                          ? 'bg-gray-800 border border-gray-700' 
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl ${palette.bg}`}>
                          <Icon className={`w-6 h-6 ${palette.text}`} />
                        </div>
                        <span className={`text-xs font-heading font-bold px-3 py-1 rounded-full tracking-wide ${palette.chip}`}>
                          {percentage}%
                        </span>
                      </div>
                      
                      <h3 className="text-gray-600 dark:text-gray-400 text-xs font-heading font-semibold mb-2 capitalize uppercase tracking-wide">
                        {item.name}
                      </h3>
                      
                      <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-heading font-bold text-gray-900 dark:text-white leading-tight">
                          {formatCurrency(item.value)}
                        </p>
                      </div>
                      
                      <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(to right, ${palette.fill}, ${palette.fill})` }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`rounded-2xl p-6 shadow-lg ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}
            >
              <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-5 tracking-tight">
                Monthly Earnings Trend
              </h2>
              {monthlyRevenue.length === 0 ? (
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  No monthly revenue data available yet.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={monthlyRevenue} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="monthlyRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#E5E7EB'} opacity={0.5} />
                    <XAxis dataKey="month" stroke={isDark ? '#9CA3AF' : '#6B7280'} tick={{ fontSize: 12 }} />
                    <YAxis stroke={isDark ? '#9CA3AF' : '#6B7280'} tick={{ fontSize: 12 }} />
                    <Tooltip
                      formatter={(value, name) => [name === 'revenue' ? formatCurrency(value) : value, name === 'revenue' ? 'Revenue' : 'Bookings']}
                      contentStyle={{
                        backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                        border: `1px solid ${isDark ? '#6C5CE7' : '#A29BFE'}`,
                        borderRadius: '0.75rem',
                      }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="url(#monthlyRevenueGradient)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default TotalEarningsPage;
