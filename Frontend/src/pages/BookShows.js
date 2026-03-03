import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiInfo, FiMoon, FiSun, FiStar, FiTrendingUp } from 'react-icons/fi';
import Carousel from './Carousel';
import AboutMuseum from './AboutMuseum';
import Chatbot from './Chatbot';
import { useTheme } from './ThemeContext';

const Bookshows = () => {
  const { isDark, toggleTheme } = useTheme();
  const [showAboutMuseum, setShowAboutMuseum] = useState(false);
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="relative overflow-hidden">
        <div className={`pointer-events-none absolute inset-0 ${isDark ? 'bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900' : 'bg-gradient-to-br from-white via-purple-50 to-white'}`} />

        <div className="relative mx-auto w-full max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pt-8">
          <div className="flex items-center justify-between">
            <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wide ${isDark ? 'border-purple-700/50 bg-purple-900/30 text-purple-300' : 'border-purple-200 bg-purple-50/80 text-purple-600'}`}>
              <FiStar className="h-4 w-4" />
              Curated Museum Experiences
            </div>

            <button
              onClick={toggleTheme}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-md transition-all duration-200 hover:-translate-y-0.5 ${isDark ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {isDark ? <FiSun className="h-4 w-4" /> : <FiMoon className="h-4 w-4" />}
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="lg:col-span-8"
            >
              <h1 className={`text-5xl font-black tracking-tighter sm:text-6xl lg:text-7xl leading-tight bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 ${isDark ? 'dark:from-purple-400 dark:via-pink-400 dark:to-rose-400 bg-clip-text text-transparent' : 'bg-clip-text text-transparent'}`}>
                Discover, Compare,
                <span className="block">and Book</span>
                <span className={`block ${isDark ? 'text-white' : 'text-gray-900'}`}>Premium Shows</span>
              </h1>
              <p className={`mt-6 max-w-2xl text-lg leading-relaxed sm:text-xl font-medium ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                Browse handpicked exhibitions and live museum programs in a cinematic experience. Tap any show card to book in seconds.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigate('/events')}
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-purple-500/50"
                >
                  <FiTrendingUp className="h-4 w-4" />
                  Explore Events
                </button>
                <button
                  onClick={() => setShowAboutMuseum((prev) => !prev)}
                  className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 ${isDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
                >
                  <FiInfo className="h-4 w-4" />
                  {showAboutMuseum ? 'Hide Museum Info' : 'About the Museum'}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="lg:col-span-4"
            >
              <div className={`rounded-3xl border p-6 shadow-xl backdrop-blur-sm ${isDark ? 'border-purple-700/30 bg-purple-900/40' : 'border-purple-200 bg-purple-50/80'}`}>
                <p className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>
                  💡 Booking Tip
                </p>
                <h3 className={`mt-3 text-2xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Best Slots Fill Fast
                </h3>
                <p className={`mt-3 text-base leading-relaxed font-medium ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                  Book early to secure premium seating. Available spots book quickly during peak times.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.25 }}
          className={`rounded-3xl border p-4 shadow-2xl sm:p-6 ${isDark ? 'border-purple-700/30 bg-gray-800/50' : 'border-purple-200 bg-white'}`}
        >
          <Carousel onSlideClick={() => {}} />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.35 }}
          className="mt-8"
        >
          {showAboutMuseum && (
            <div className={`rounded-3xl border p-6 shadow-lg ${isDark ? 'border-purple-700/30 bg-gray-800/50' : 'border-purple-200 bg-purple-50/50'}`}>
              <AboutMuseum />
            </div>
          )}
        </motion.section>
      </main>

      <Chatbot />
    </div>
  );
};

export default Bookshows;
