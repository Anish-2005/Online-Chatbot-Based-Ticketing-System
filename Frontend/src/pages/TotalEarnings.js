import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeContext';
import { FiDollarSign, FiTrendingUp, FiPieChart, FiCreditCard } from 'react-icons/fi';
import { fetchEarningsBreakdown } from '../services/metrics';

const TotalEarningsPage = ({ role }) => {
  const { isDark, toggleTheme } = useTheme();
  const [earningsBreakdown, setEarningsBreakdown] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEarnings = async () => {
      setLoading(true);
      try {
        const data = await fetchEarningsBreakdown();
        setEarningsBreakdown(data || {});
      } catch (error) {
        console.error('Error fetching earnings data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEarnings();
  }, []);

  const totalEarnings = Object.values(earningsBreakdown).reduce(
    (acc, value) => acc + value,
    0
  );

  const formatCategoryName = (key) => {
    return key.replace(/([A-Z])/g, ' $1').trim();
  };

  const getCategoryIcon = (index) => {
    const icons = [FiDollarSign, FiCreditCard, FiPieChart, FiTrendingUp];
    return icons[index % icons.length];
  };

  const getCategoryColor = (index) => {
    const colors = ['purple', 'blue', 'green', 'pink', 'orange', 'indigo'];
    return colors[index % colors.length];
  };

  return (
    <div className={`flex min-h-screen ${isDark ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Sidebar role={role} />

      <div className="flex-1 ml-64 p-8">
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
            <button
              onClick={toggleTheme}
              className="px-6 py-3 rounded-xl font-heading font-semibold shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-emerald-500/50 dark:from-emerald-500 dark:to-teal-500 text-base"
            >
              {isDark ? '☀️ Light' : '🌙 Dark'}
            </button>
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
                      ${totalEarnings.toLocaleString()}
                    </p>
                  </div>
                </div>
                <p className="text-white/70 text-base font-medium">
                  All-time earnings across all categories
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <h2 className="text-3xl font-heading font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
                Revenue Breakdown
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(earningsBreakdown).map(([key, value], index) => {
                  const Icon = getCategoryIcon(index);
                  const color = getCategoryColor(index);
                  const percentage = ((value / totalEarnings) * 100).toFixed(1);
                  
                  return (
                    <motion.div
                      key={key}
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
                        <div className={`p-3 rounded-xl bg-${color}-100 dark:bg-${color}-900/20`}>
                          <Icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />
                        </div>
                        <span className={`text-xs font-heading font-bold px-3 py-1 rounded-full bg-${color}-100 text-${color}-700 dark:bg-${color}-900/30 dark:text-${color}-400 tracking-wide`}>
                          {percentage}%
                        </span>
                      </div>
                      
                      <h3 className="text-gray-600 dark:text-gray-400 text-xs font-heading font-semibold mb-2 capitalize uppercase tracking-wide">
                        {formatCategoryName(key)}
                      </h3>
                      
                      <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-heading font-bold text-gray-900 dark:text-white leading-tight">
                          ${value.toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                          className={`h-full bg-gradient-to-r from-${color}-500 to-${color}-600 rounded-full`}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default TotalEarningsPage;
