import ThemeToggleButton from '../components/ThemeToggleButton';
import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiMapPin, FiClock, FiUsers, FiSearch, FiGrid, FiList } from 'react-icons/fi';
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
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'}`}>
      <div className="relative overflow-hidden">
        <div className={`pointer-events-none absolute inset-0 ${isDark ? 'bg-gradient-to-br from-gray-950 via-indigo-950/15 to-gray-950' : 'bg-gradient-to-br from-white via-indigo-50/40 to-white'}`} />

        <div className="relative mx-auto w-full max-w-7xl px-4 pb-8 pt-6 sm:px-6 lg:px-8">
          {/* Top bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <motion.button
              onClick={() => navigate('/bookshows')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${isDark ? 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700/50' : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-200'}`}
            >
              <FiArrowLeft className="h-4 w-4" />
              Back to Shows
            </motion.button>
            <ThemeToggleButton />
          </div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8"
          >
            <h1 className="text-4xl font-heading font-black tracking-tight sm:text-5xl">
              <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-600 dark:from-indigo-400 dark:via-blue-400 dark:to-sky-400 bg-clip-text text-transparent">
                Upcoming
              </span>
              <span className={`block ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Events & Exhibitions
              </span>
            </h1>
            <p className={`mt-4 max-w-3xl text-base sm:text-lg font-medium leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Explore our curated collection of museum exhibitions, live shows, and cultural experiences.
            </p>
          </motion.div>

          {/* Search & View Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mt-6 flex flex-wrap items-center gap-3"
          >
            <div className={`relative flex-1 min-w-[240px] max-w-md`}>
              <FiSearch className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${isDark ? 'bg-gray-800 border-gray-700/50 text-white placeholder-gray-500' : 'bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-400'} border`}
              />
            </div>

            <div className={`flex rounded-xl border overflow-hidden ${isDark ? 'border-gray-700/50' : 'border-gray-200'}`}>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 transition-all ${viewMode === 'grid' ? (isDark ? 'bg-indigo-600 text-white' : 'bg-indigo-600 text-white') : (isDark ? 'bg-gray-800 text-gray-400 hover:text-white' : 'bg-white text-gray-500 hover:text-gray-900')}`}
              >
                <FiGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 transition-all ${viewMode === 'list' ? (isDark ? 'bg-indigo-600 text-white' : 'bg-indigo-600 text-white') : (isDark ? 'bg-gray-800 text-gray-400 hover:text-white' : 'bg-white text-gray-500 hover:text-gray-900')}`}
              >
                <FiList className="h-4 w-4" />
              </button>
            </div>

            <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${isDark ? 'bg-indigo-900/40 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}`}>
              {filteredShows.length} event{filteredShows.length === 1 ? '' : 's'}
            </span>
          </motion.div>
        </div>
      </div>

      {/* Events Content */}
      <main className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        {/* Loading State */}
        {loading && (
          <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`rounded-2xl border p-5 ${isDark ? 'border-gray-700/50 bg-gray-800/60' : 'border-gray-200 bg-gray-50'}`}
              >
                <div className={`h-40 rounded-xl mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} skeleton`} />
                <div className={`h-5 w-3/4 rounded-lg mb-3 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} skeleton`} />
                <div className={`h-4 w-1/2 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-200'} skeleton`} />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`rounded-2xl border p-6 text-center ${isDark ? 'border-red-500/30 bg-red-900/20 text-red-300' : 'border-red-200 bg-red-50 text-red-700'}`}
          >
            <p className="font-semibold">{error}</p>
            <button
              onClick={loadShows}
              className="mt-3 px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-indigo-600 to-blue-600 text-white"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredShows.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`rounded-2xl border p-8 text-center ${isDark ? 'border-gray-700/50 bg-gray-800/40' : 'border-gray-200 bg-gray-50'}`}
          >
            <p className={`text-lg font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {searchQuery ? `No events matching "${searchQuery}"` : 'No upcoming events available'}
            </p>
          </motion.div>
        )}

        {/* Events Grid */}
        {!loading && !error && filteredShows.length > 0 && (
          <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredShows.map((show, index) => (
              <motion.div
                key={show.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                onClick={() => navigate(`/booking/${show.id}`)}
                className={`group cursor-pointer rounded-2xl border overflow-hidden transition-all duration-300 ${isDark ? 'border-gray-700/50 bg-gray-800/60 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5' : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10'}`}
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={show.image || 'https://placehold.co/600x400/6C5CE7/ffffff?text=Museum+Show'}
                    alt={show.title || 'Museum Show'}
                    className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Price badge */}
                  <div className="absolute top-3 right-3">
                    <span className="rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1.5 text-sm font-bold text-indigo-700 dark:text-indigo-300 shadow-lg">
                      {show.price || '₹100'}
                    </span>
                  </div>
                  {/* Availability indicator */}
                  {Number(show.ticketsLeft) <= 5 && Number(show.ticketsLeft) > 0 && (
                    <div className="absolute top-3 left-3">
                      <span className="rounded-full bg-red-500/90 backdrop-blur-sm px-3 py-1 text-xs font-bold text-white shadow-lg">
                        Only {show.ticketsLeft} left!
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className={`text-lg font-heading font-bold mb-2 transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {show.title || 'Museum Show'}
                  </h3>

                  <div className="space-y-2">
                    {show.date && (
                      <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        <FiCalendar className="h-3.5 w-3.5" />
                        <span>{show.date}</span>
                      </div>
                    )}
                    {show.time && (
                      <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        <FiClock className="h-3.5 w-3.5" />
                        <span>{show.time}</span>
                      </div>
                    )}
                    {show.location && (
                      <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        <FiMapPin className="h-3.5 w-3.5" />
                        <span>{show.location}</span>
                      </div>
                    )}
                  </div>

                  <div className={`mt-4 pt-4 border-t flex items-center justify-between ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                    <div className={`flex items-center gap-1.5 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      <FiUsers className="h-3.5 w-3.5" />
                      <span>{show.ticketsLeft || 0} seats left</span>
                    </div>
                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                      Book Now →
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default EventsPage;
