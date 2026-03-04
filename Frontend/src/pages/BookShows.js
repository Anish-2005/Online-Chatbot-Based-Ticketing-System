import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiInfo, FiStar, FiTrendingUp, FiCreditCard, FiUser } from 'react-icons/fi';
import Carousel from './Carousel';
import AboutMuseum from './AboutMuseum';
import { useTheme } from './ThemeContext';
import ThemeToggleButton from '../components/ThemeToggleButton';

const Bookshows = () => {
  const { isDark } = useTheme();
  const [showAboutMuseum, setShowAboutMuseum] = useState(false);
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'}`}>
      {/* Subtle background gradient */}
      <div className="relative overflow-hidden">
        <div className={`pointer-events-none absolute inset-0 ${isDark ? 'bg-gradient-to-br from-gray-950 via-violet-950/20 to-gray-950' : 'bg-gradient-to-br from-white via-violet-50/50 to-white'}`} />

        {/* Top Navigation Bar */}
        <div className="relative z-20">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              {/* Left: Logo + Brand */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center gap-3 group"
                >
                  <img src="/chat-ticket-logo.svg" alt="ChatTicket" className="w-10 h-10 drop-shadow-lg" />
                  <span className={`text-lg font-heading font-bold tracking-tight hidden sm:inline ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Chat<span className="bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">Ticket</span>
                  </span>
                </button>

                <div className={`hidden md:inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider ${isDark ? 'border-violet-700/50 bg-violet-900/30 text-violet-300' : 'border-violet-200 bg-violet-50/80 text-violet-600'}`}>
                  <FiStar className="h-3 w-3" />
                  Curated Museum Experiences
                </div>
              </div>

              {/* Right: Navigation actions */}
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => navigate('/my-shows')}
                  className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700/50' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'}`}
                >
                  <FiCreditCard className="h-4 w-4" />
                  My Shows
                </button>
                <ThemeToggleButton />
                <button
                  onClick={() => navigate('/my-shows')}
                  className={`sm:hidden p-2 rounded-xl transition-all ${isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  title="My Shows"
                >
                  <FiUser className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative mx-auto w-full max-w-7xl px-4 pb-12 pt-4 sm:px-6 lg:px-8 lg:pt-6">
          <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-end">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-8"
            >
              <h1
                className="text-4xl font-heading font-black tracking-tight sm:text-5xl lg:text-6xl leading-[1.1]"
              >
                <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 dark:from-violet-400 dark:via-indigo-400 dark:to-blue-400 bg-clip-text text-transparent">
                  Discover & Book
                </span>
                <br />
                <span className={isDark ? 'text-white' : 'text-gray-900'}>Premium Shows</span>
              </h1>
              <p className={`mt-5 max-w-2xl text-base sm:text-lg leading-relaxed font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Browse handpicked exhibitions and live museum programs. Tap any show card below to book in seconds.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <motion.button
                  onClick={() => navigate('/events')}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-all bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-500/25"
                >
                  <FiTrendingUp className="h-4 w-4" />
                  Explore All Events
                </motion.button>
                <button
                  onClick={() => setShowAboutMuseum((prev) => !prev)}
                  className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all ${isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700/50' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'}`}
                >
                  <FiInfo className="h-4 w-4" />
                  {showAboutMuseum ? 'Hide Museum Info' : 'About the Museum'}
                </button>
              </div>
            </motion.div>

            {/* Booking Tip Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-4"
            >
              <div className={`rounded-2xl border p-5 backdrop-blur-sm ${isDark ? 'border-gray-700/50 bg-gray-800/60' : 'border-violet-200 bg-violet-50/60'}`}>
                <p className={`text-[11px] font-bold uppercase tracking-widest ${isDark ? 'text-violet-300' : 'text-violet-600'}`}>
                  💡 Booking Tip
                </p>
                <h3 className={`mt-2 text-xl font-heading font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Best Slots Fill Fast
                </h3>
                <p className={`mt-2 text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Book early to secure premium seating. Available spots fill quickly during peak times.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Carousel Section */}
      <main className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className={`rounded-2xl border p-4 sm:p-6 ${isDark ? 'border-gray-700/50 bg-gray-800/40' : 'border-gray-200 bg-white shadow-lg shadow-gray-200/50'}`}
        >
          <Carousel onSlideClick={() => { }} />
        </motion.section>

        {/* About Museum Section */}
        {showAboutMuseum && (
          <motion.section
            initial={{ opacity: 0, y: 16, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="mt-6"
          >
            <div className={`rounded-2xl border p-6 ${isDark ? 'border-gray-700/50 bg-gray-800/40' : 'border-gray-200 bg-gray-50'}`}>
              <AboutMuseum />
            </div>
          </motion.section>
        )}
      </main>
    </div>
  );
};

export default Bookshows;
