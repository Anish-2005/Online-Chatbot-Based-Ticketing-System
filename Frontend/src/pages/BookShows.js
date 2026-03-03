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
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <div className="relative overflow-hidden">
        <div className={`pointer-events-none absolute inset-0 ${isDark ? 'bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_transparent_45%),radial-gradient(circle_at_80%_20%,_rgba(168,85,247,0.2),_transparent_35%)]' : 'bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.14),_transparent_40%),radial-gradient(circle_at_80%_20%,_rgba(168,85,247,0.12),_transparent_32%)]'}`} />

        <div className="relative mx-auto w-full max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pt-8">
          <div className="flex items-center justify-between">
            <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${isDark ? 'border-slate-700 bg-slate-900/80 text-slate-200' : 'border-slate-200 bg-white/90 text-slate-700'}`}>
              <FiStar className="h-4 w-4" />
              Curated Museum Experiences
            </div>

            <button
              onClick={toggleTheme}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200 hover:-translate-y-0.5 ${isDark ? 'bg-slate-800 text-slate-100 hover:bg-slate-700' : 'bg-white text-slate-800 hover:bg-slate-100'}`}
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
              <h1 className={`text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Discover, Compare, and Book
                <span className={`block ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>Premium Cultural Shows</span>
              </h1>
              <p className={`mt-5 max-w-2xl text-base leading-relaxed sm:text-lg ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Browse handpicked exhibitions and live museum programs in a cinematic experience.
                Tap any show card to open details and continue booking in seconds.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigate('/events')}
                  className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 ${isDark ? 'bg-blue-500 text-white hover:bg-blue-400' : 'bg-blue-600 text-white hover:bg-blue-500'}`}
                >
                  <FiTrendingUp className="h-4 w-4" />
                  Explore Events
                </button>
                <button
                  onClick={() => setShowAboutMuseum((prev) => !prev)}
                  className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 ${isDark ? 'bg-slate-800 text-slate-100 hover:bg-slate-700' : 'bg-white text-slate-800 hover:bg-slate-100'}`}
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
              <div className={`rounded-2xl border p-5 shadow-xl backdrop-blur-sm ${isDark ? 'border-slate-700 bg-slate-900/70' : 'border-slate-200 bg-white/90'}`}>
                <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Booking Tip
                </p>
                <h3 className={`mt-2 text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Best slots fill up fast
                </h3>
                <p className={`mt-2 text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Choose shows with higher remaining availability first, then proceed to secure seats from the booking manual.
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
          className={`rounded-3xl border p-4 shadow-2xl sm:p-6 ${isDark ? 'border-slate-800 bg-slate-900/70' : 'border-slate-200 bg-white'}`}
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
            <div className={`rounded-3xl border p-6 shadow-lg ${isDark ? 'border-slate-800 bg-slate-900/70' : 'border-slate-200 bg-white'}`}>
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
