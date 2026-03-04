import ThemeToggleButton from '../components/ThemeToggleButton';
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeContext';
import { FiArrowLeft, FiCalendar } from 'react-icons/fi';

const BookingManualPage = () => {
  const { isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // Access the event data from location state
  const { event } = location.state || {};

  useEffect(() => {
    if (!event) {
      console.warn('No event data received');
    }
  }, [event]);

  return (
    <div className={`min-h-screen relative transition-colors duration-500 overflow-x-hidden ${isDark ? 'dark bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} selection:bg-indigo-500/30`}>
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-5%] right-[-10%] w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-indigo-600/10 rounded-full blur-[80px] sm:blur-[120px] animate-float opacity-50 sm:opacity-100" />
        <div className="absolute bottom-[20%] left-[-5%] w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-violet-600/10 rounded-full blur-[70px] sm:blur-[100px] animate-pulse-subtle opacity-50 sm:opacity-100" />
      </div>

      <div className="relative z-10 w-full">
        {/* Header Content */}
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-8">
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
              <FiCalendar className="text-xs" />
              Reservation Manual
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-heading font-black leading-[1.1] sm:leading-[0.9] tracking-tight mb-6">
              Booking <span className="gradient-text">Manual.</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl leading-relaxed">
              Review your selected exhibition details and confirm your security protocols before seat selection.
            </p>
          </motion.div>
        </div>
      </div>

      <main className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        {!event ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-premium p-10 sm:p-20 rounded-[2rem] sm:rounded-[3rem] text-center border border-white/20 dark:border-slate-800/50 shadow-2xl"
          >
            <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-900 mx-auto flex items-center justify-center mb-8">
              <FiArrowLeft className="text-3xl text-slate-400" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-heading font-black mb-4 uppercase tracking-tight">No Experience Selected</h3>
            <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto">Please return to the main catalog and choose an exhibition to begin your booking process.</p>
            <button
              onClick={() => navigate('/bookshows')}
              className="px-8 py-4 rounded-xl sm:rounded-2xl bg-indigo-600 text-white font-black shadow-2xl shadow-indigo-600/30 w-full sm:w-auto transition-transform hover:scale-105 active:scale-95"
            >
              Browse Catalog
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-premium rounded-[2rem] sm:rounded-[3.5rem] border border-white/20 dark:border-slate-800/50 shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col lg:flex-row">
              {/* Event Visual */}
              <div className="w-full lg:w-[40%] h-64 sm:h-96 lg:h-auto overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
              </div>

              {/* Event Data */}
              <div className="flex-1 p-8 sm:p-12 lg:p-16">
                <h2 className="text-3xl sm:text-5xl font-heading font-black mb-8 uppercase tracking-tighter leading-none">{event.title}</h2>

                <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 sm:gap-6 mb-10">
                  <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Exhibition Date</span>
                    <p className="text-lg font-bold">{event.date || 'TBA'}</p>
                  </div>

                  <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Primary Time</span>
                    <p className="text-lg font-bold">{event.time || 'TBA'}</p>
                  </div>

                  <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Venue Location</span>
                    <p className="text-lg font-bold truncate">{event.location || 'Venue TBA'}</p>
                  </div>

                  <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 block mb-2">Access Price</span>
                    <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{event.price || '—'}</p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 mb-10">
                  <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic">
                    "Secure encryption protocols are active. By continuing, you agree to the exhibition terms of service."
                  </p>
                </div>

                <div className="flex flex-col xs:flex-row gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/booking', { state: { event } })}
                    className="flex-1 px-8 py-4 sm:py-5 rounded-2xl bg-indigo-600 text-white font-black shadow-2xl shadow-indigo-600/30 flex items-center justify-center gap-3"
                  >
                    Confirm & Select Seats
                    <FiArrowLeft className="rotate-180" />
                  </motion.button>
                  <button
                    onClick={() => navigate('/events')}
                    className="px-8 py-4 sm:py-5 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black transition-colors hover:bg-slate-300 dark:hover:bg-slate-700"
                  >
                    Browse Others
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default BookingManualPage;
