import ThemeToggleButton from '../components/ThemeToggleButton';
import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiMapPin, FiClock, FiSearch, FiGrid, FiList } from 'react-icons/fi';
import { useTheme } from './ThemeContext';
import { fetchShows } from '../services/shows';

const EventsPage = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  const loadShows = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchShows();
      setShows(Array.isArray(data) ? data : []);
    } catch (fetchError) {
      setError(fetchError.message || 'Unable to load events.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadShows();
  }, [loadShows]);

  const filteredShows = shows.filter((show) =>
    (show.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (show.location || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen relative transition-colors duration-500 overflow-x-hidden ${isDark ? 'dark bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} selection:bg-indigo-500/30`}>
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-5%] right-[-10%] w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-indigo-600/10 rounded-full blur-[80px] sm:blur-[120px] animate-float opacity-50 sm:opacity-100" />
        <div className="absolute bottom-[20%] left-[-5%] w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-violet-600/10 rounded-full blur-[70px] sm:blur-[100px] animate-pulse-subtle opacity-50 sm:opacity-100" />
      </div>

      <div className="relative z-10 w-full">
        {/* Header Content */}
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-6 sm:px-6 lg:px-8">
          {/* Nav bar */}
          <div className="flex items-center justify-between gap-4 mb-10 sm:mb-16">
            <motion.button
              onClick={() => navigate('/bookshows')}
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 sm:gap-3 px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-black text-xs sm:text-sm shadow-xl transition-all`}
            >
              <FiArrowLeft className="text-indigo-500" />
              <span className="hidden xs:inline">Back to Catalog</span>
              <span className="xs:hidden">Back</span>
            </motion.button>
            <ThemeToggleButton />
          </div>

          {/* Title Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10 sm:mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-6">
              <FiGrid className="text-xs" />
              Live Curations
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-heading font-black leading-[1.1] sm:leading-[0.9] tracking-tight mb-6">
              Upcoming <span className="gradient-text">Experiences.</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl leading-relaxed">
              Explore our curated collection of high-access exhibitions, live shows, and immersive cultural viewings.
            </p>
          </motion.div>

          {/* Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 pb-6 sm:pb-10"
          >
            <div className="relative flex-1 group">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                placeholder="Search location or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center justify-between sm:justify-start gap-4">
              <div className="flex p-1 rounded-xl sm:rounded-2xl bg-slate-200/50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-md' : 'text-slate-500 hover:text-indigo-500'}`}
                >
                  <FiGrid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-md' : 'text-slate-500 hover:text-indigo-500'}`}
                >
                  <FiList size={18} />
                </button>
              </div>

              <span className="px-4 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-xs font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                {filteredShows.length} Result{filteredShows.length !== 1 ? 's' : ''}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Catalog Content */}
        <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-32">
          {loading ? (
            <div className={`grid gap-6 sm:gap-8 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-[420px] rounded-[2.5rem] skeleton opacity-50" />
              ))}
            </div>
          ) : error ? (
            <div className="glass-premium p-10 sm:p-20 rounded-[3rem] text-center border border-red-500/20">
              <p className="text-red-500 font-bold mb-6">{error}</p>
              <button onClick={loadShows} className="px-10 py-4 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white font-black">Try Again</button>
            </div>
          ) : filteredShows.length === 0 ? (
            <div className="glass-premium p-10 sm:p-20 rounded-[3rem] text-center border border-white/20 dark:border-slate-800/50">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-slate-100 dark:bg-slate-900 mx-auto flex items-center justify-center mb-8">
                <FiSearch className="text-4xl text-slate-300" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-heading font-black mb-4">No showings found.</h3>
              <p className="text-slate-500 font-medium max-w-md mx-auto">Try adjusting your search criteria to find available exhibitions.</p>
            </div>
          ) : (
            <div className={`grid gap-6 sm:gap-8 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {filteredShows.map((show, index) => (
                <motion.div
                  key={show.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                  onClick={() => navigate(`/booking/${show.id}`)}
                  className={`group cursor-pointer glass-premium rounded-[2rem] sm:rounded-[2.5rem] border border-white/20 dark:border-slate-800/50 shadow-2xl overflow-hidden transition-all duration-500 ${viewMode === 'list' ? 'flex flex-col md:flex-row gap-8 p-6' : ''}`}
                >
                  {/* Visual Asset */}
                  <div className={`relative overflow-hidden ${viewMode === 'list' ? 'h-52 md:h-auto md:w-80 rounded-[1.5rem] sm:rounded-[2rem] shrink-0' : 'h-64 sm:h-72'}`}>
                    <img
                      src={show.image || 'https://images.unsplash.com/photo-1544967082-d9d25d867d66'}
                      alt={show.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 shadow-xl border border-white/20">
                        {show.price}
                      </span>
                    </div>
                  </div>

                  {/* Content Asset */}
                  <div className={`flex flex-col h-full ${viewMode === 'grid' ? 'p-6 sm:p-8' : 'justify-center flex-1'}`}>
                    <h3 className="text-xl sm:text-2xl font-heading font-black mb-3 group-hover:text-indigo-500 transition-colors uppercase tracking-tight line-clamp-1">{show.title}</h3>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest">
                        <FiCalendar className="text-indigo-500 text-sm" />
                        {show.date}
                      </div>
                      <div className="flex items-center gap-3 text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest">
                        <FiClock className="text-indigo-500 text-sm" />
                        {show.time}
                      </div>
                      <div className="flex items-center gap-3 text-[10px] sm:text-xs font-bold text-slate-400">
                        <FiMapPin className="text-indigo-500 text-sm" />
                        {show.location}
                      </div>
                    </div>

                    <div className="mt-auto pt-6 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Availability</span>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${Number(show.ticketsLeft) < 10 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
                          <span className="text-sm font-black">{show.ticketsLeft} Reserved Seats</span>
                        </div>
                      </div>
                      <motion.div
                        whileHover={{ x: 5 }}
                        className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 ring-1 ring-slate-200 dark:ring-slate-800 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-lg"
                      >
                        <FiArrowLeft className="rotate-180 text-lg" />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};


export default EventsPage;
