import ThemeToggleButton from '../components/ThemeToggleButton';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeContext';
import { fetchShows } from '../services/shows';
import Carousel from './Carousel';

const EventsPage = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadShows = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchShows();
        setShows(Array.isArray(data) ? data : []);
      } catch (fetchError) {
        setError(fetchError.message || 'Unable to load events right now.');
      } finally {
        setLoading(false);
      }
    };

    loadShows();
  }, []);

  const onSlideClick = (show) => {
    navigate('/booking-manual', { state: { event: show } });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="relative overflow-hidden">
        <div className={`pointer-events-none absolute inset-0 ${isDark ? 'bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900' : 'bg-gradient-to-br from-white via-purple-50 to-white'}`} />

        <div className="relative mx-auto w-full max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pt-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <motion.button
              onClick={() => navigate('/bookshows')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className={`inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${isDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
            >
              ← Back to Dashboard
            </motion.button>
            <ThemeToggleButton />
</div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mt-8"
          >
            <h1 className={`text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl leading-[1.15] bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 ${isDark ? 'dark:from-purple-400 dark:via-pink-400 dark:to-rose-400 bg-clip-text text-transparent' : 'bg-clip-text text-transparent'}`}>
              Explore Live
              <span className={`block ${isDark ? 'text-white' : 'text-gray-900'}`}>Events & Experiences</span>
            </h1>
            <p className={`mt-4 max-w-3xl text-lg sm:text-xl font-medium leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Discover upcoming museum shows, exhibitions, and special sessions. Click any event card to open booking details instantly.
            </p>
          </motion.div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className={`rounded-3xl border p-4 shadow-2xl sm:p-6 ${isDark ? 'border-purple-700/30 bg-gray-800/50' : 'border-purple-200 bg-white'}`}
        >
          <Carousel onSlideClick={onSlideClick} />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.25 }}
          className="mt-8"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className={`text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Latest Events
            </h2>
            {!loading && !error && (
              <span className={`text-sm font-semibold ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>
                {shows.length} event{shows.length === 1 ? '' : 's'}
              </span>
            )}
          </div>

          {loading && (
            <div className={`rounded-2xl border p-5 text-sm font-medium ${isDark ? 'border-purple-700/30 bg-gray-800/50 text-gray-300' : 'border-purple-200 bg-purple-50/60 text-gray-700'}`}>
              Loading events...
            </div>
          )}

          {!loading && error && (
            <div className={`rounded-2xl border p-5 text-sm font-medium ${isDark ? 'border-red-500/30 bg-red-900/20 text-red-200' : 'border-red-200 bg-red-50 text-red-700'}`}>
              {error}
            </div>
          )}

          {!loading && !error && shows.length === 0 && (
            <div className={`rounded-2xl border p-5 text-sm font-medium ${isDark ? 'border-purple-700/30 bg-gray-800/50 text-gray-300' : 'border-purple-200 bg-purple-50/60 text-gray-700'}`}>
              No events available yet. Ask admin to add shows from Manage Shows.
            </div>
          )}

          {!loading && !error && shows.length > 0 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {shows.map((show, index) => (
                <motion.button
                  key={show.id || `${show.title}-${index}`}
                  type="button"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.2) }}
                  onClick={() => onSlideClick(show)}
                  className={`group overflow-hidden rounded-2xl border text-left transition-all hover:-translate-y-1 ${isDark ? 'border-purple-700/30 bg-gray-800/60 hover:border-purple-500/60' : 'border-purple-200 bg-white hover:border-purple-300'} hover:shadow-xl`}
                >
                  <img
                    src={show.image}
                    alt={show.title}
                    className="h-52 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <div className="p-4">
                    <h3 className={`text-lg font-bold leading-snug ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {show.title}
                    </h3>
                    <p className={`mt-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {show.date} • {show.time}
                    </p>
                    <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {show.location}
                    </p>
                    <p className={`mt-3 text-sm font-extrabold ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
                      {show.price}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </motion.section>
      </main>
    </div>
  );
};

export default EventsPage;
