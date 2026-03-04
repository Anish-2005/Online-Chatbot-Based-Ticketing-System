import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  FiSearch,
  FiFilter
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
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

const AdminDashboard = ({ role }) => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError('');
    try {
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out.')), 15000)
      );
      const data = await Promise.race([fetchAdminDashboardData(), timeout]);
      setDashboardData(data);
    } catch (loadError) {
      setError(loadError.message || 'Failed to load dashboard.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadDashboard(false); }, [loadDashboard]);

  const kpis = useMemo(() => dashboardData?.kpis || {
    totalRevenue: 0, activeUsers: 0, bookingsToday: 0, conversionRate: 0,
    totalTicketsSold: 0, totalShows: 0, todayRevenue: 0, upcomingShows: 0,
  }, [dashboardData?.kpis]);

  const stats = useMemo(() => [
    { title: 'Total Revenue', value: formatCurrency(kpis.totalRevenue), trend: '+12.5%', icon: FiDollarSign, gradient: 'from-emerald-500 to-teal-600', color: 'emerald' },
    { title: 'Active Users', value: kpis.activeUsers.toLocaleString(), trend: '+5.2%', icon: FiUsers, gradient: 'from-indigo-500 to-violet-600', color: 'indigo' },
    { title: 'Tickets Sold', value: kpis.totalTicketsSold.toLocaleString(), trend: '+8.1%', icon: FiLayers, gradient: 'from-violet-500 to-fuchsia-600', color: 'violet' },
    { title: 'Avg. Fill Rate', value: `${Number(kpis.conversionRate || 0).toFixed(1)}%`, trend: '-2.4%', icon: FiTrendingUp, gradient: 'from-orange-500 to-rose-600', color: 'orange' },
  ], [kpis]);

  return (
    <div className={`flex min-h-screen ${isDark ? 'dark bg-slate-950' : 'bg-slate-50'} bg-mesh selection:bg-indigo-500/30`}>
      <Sidebar role={role} />

      <main className="flex-1 p-4 sm:p-6 lg:p-10 transition-all duration-300 overflow-x-hidden min-w-0" style={{ marginLeft: 'var(--admin-sidebar-width, 0rem)' }}>
        {/* Mobile Spacer (for floating toggle button) */}
        <div className="h-20 lg:hidden" />
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl sm:text-5xl font-heading font-black tracking-tight mb-2"
            >
              Control <span className="gradient-text">Hub.</span>
            </motion.h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Monitoring live operations for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <FiSearch className="text-slate-400" />
              <input type="text" placeholder="Search data..." className="bg-transparent border-none outline-none text-sm font-medium w-32" />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => loadDashboard(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-black text-sm shadow-xl hover:shadow-indigo-500/10 transition-all"
            >
              <FiRefreshCw className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Syncing...' : 'Refresh'}
            </motion.button>
          </div>
        </header>

        {/* Dashboard Content */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            >
              {[1, 2, 3, 4].map(i => <div key={i} className="h-44 rounded-3xl skeleton" />)}
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ y: -8 }}
                      className="glass-premium p-6 rounded-[2.5rem] relative overflow-hidden group"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${stat.gradient} shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-500`}>
                          <Icon className="text-2xl text-white" />
                        </div>
                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${stat.trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'} border`}>
                          {stat.trend}
                        </span>
                      </div>

                      <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">{stat.title}</p>
                      <h3 className="text-3xl font-heading font-black text-slate-900 dark:text-white mb-4 tracking-tight">{stat.value}</h3>

                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                        <FiActivity className="text-indigo-500" />
                        Live tracking active
                      </div>

                      {/* Accent glow on hover */}
                      <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity`} />
                    </motion.div>
                  );
                })}
              </div>

              {/* Charts & Activity Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity Card */}
                <div className="lg:col-span-2 glass-premium p-8 rounded-[2.5rem]">
                  <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-heading font-black text-slate-900 dark:text-white">Recent <span className="gradient-text">Activity.</span></h2>
                    <button className="text-xs font-black uppercase tracking-[0.2em] text-indigo-500 hover:text-indigo-600">View All activity</button>
                  </div>

                  <div className="space-y-6">
                    {dashboardData?.recentActivity?.slice(0, 5).map((activity, idx) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-center gap-5 p-4 rounded-3xl hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
                      >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${idx % 2 === 0 ? 'bg-indigo-500/10 text-indigo-500' : 'bg-violet-500/10 text-violet-500'} font-black text-xs`}>
                          {activity.user?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-heading font-bold text-slate-900 dark:text-white text-base leading-tight">{activity.action}</h4>
                          <p className="text-xs text-slate-400 font-medium">by <span className="text-slate-600 dark:text-slate-300">{activity.user}</span> • {activity.details}</p>
                        </div>
                        <div className="text-right">
                          {activity.amount > 0 && <p className="text-sm font-black text-slate-900 dark:text-white mb-0.5">{formatCurrency(activity.amount)}</p>}
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{formatRelativeTime(activity.timestamp)}</p>
                        </div>
                      </motion.div>
                    ))}
                    {!dashboardData?.recentActivity?.length && (
                      <div className="text-center py-12 opacity-50">No recent transactions recorded.</div>
                    )}
                  </div>
                </div>

                {/* Top Shows Card */}
                <div className="glass-premium p-8 rounded-[2.5rem]">
                  <h2 className="text-3xl font-heading font-black text-slate-900 dark:text-white mb-10">Top <span className="gradient-text">Shows.</span></h2>
                  <div className="space-y-8">
                    {dashboardData?.topShows?.slice(0, 4).map((show, idx) => (
                      <div key={show.id} className="relative">
                        <div className="flex justify-between items-end mb-2">
                          <div>
                            <h4 className="font-heading font-bold text-slate-900 dark:text-white text-sm mb-0.5">{show.title}</h4>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{show.date}</p>
                          </div>
                          <span className="text-xs font-black text-indigo-500">{show.occupancyRate}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${show.occupancyRate}%` }}
                            transition={{ duration: 1.5, delay: 0.5 + (idx * 0.1) }}
                            className={`h-full bg-gradient-to-r ${idx % 2 === 0 ? 'from-indigo-600 to-violet-600' : 'from-blue-600 to-cyan-600'}`}
                          />
                        </div>
                      </div>
                    ))}
                    {!dashboardData?.topShows?.length && (
                      <div className="text-center py-12 opacity-50">Analytical data pending.</div>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/adminshows')}
                    className="w-full mt-10 p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-100 transition-all border border-indigo-100/50"
                  >
                    View all venues
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminDashboard;
