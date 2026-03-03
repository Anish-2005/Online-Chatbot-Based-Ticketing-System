import ThemeToggleButton from '../components/ThemeToggleButton';
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeContext';

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
              ← Back to Shows
            </motion.button>
            <ThemeToggleButton />
</div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mt-8"
          >
            <h1 className={`text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl leading-[1.15] bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 ${isDark ? 'dark:from-purple-400 dark:via-pink-400 dark:to-rose-400 bg-clip-text text-transparent' : 'bg-clip-text text-transparent'}`}>
              Booking Manual
              <span className={`block ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Event Details
              </span>
            </h1>
            <p className={`mt-4 max-w-3xl text-base sm:text-lg font-medium leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Review your selected event information and continue to seat selection securely.
            </p>
          </motion.div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        {!event ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`rounded-3xl border p-8 text-center shadow-xl ${isDark ? 'border-purple-700/30 bg-gray-800/50' : 'border-purple-200 bg-white'}`}
          >
            <h2 className={`text-2xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              No Show Selected
            </h2>
            <p className={`mt-3 text-sm sm:text-base ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Please return to Book Shows and select an event from the carousel.
            </p>
            <button
              type="button"
              onClick={() => navigate('/bookshows')}
              className="mt-5 inline-flex items-center rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:from-purple-700 hover:to-pink-700"
            >
              Go to Book Shows
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className={`overflow-hidden rounded-3xl border shadow-2xl ${isDark ? 'border-purple-700/30 bg-gray-800/60' : 'border-purple-200 bg-white'}`}
          >
            <div className="grid gap-0 lg:grid-cols-5">
              <div className="lg:col-span-2">
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-full min-h-[280px] w-full object-cover lg:min-h-[420px]"
                />
              </div>

              <div className="lg:col-span-3 p-6 sm:p-8">
                <h2 className={`text-3xl sm:text-4xl font-black leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {event.title}
                </h2>

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className={`rounded-xl border p-3 ${isDark ? 'border-purple-700/30 bg-gray-900/40' : 'border-purple-100 bg-purple-50/60'}`}>
                    <p className={`text-xs font-semibold uppercase tracking-widest ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>Date</p>
                    <p className={`mt-1 text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{event.date || 'TBA'}</p>
                  </div>

                  <div className={`rounded-xl border p-3 ${isDark ? 'border-purple-700/30 bg-gray-900/40' : 'border-purple-100 bg-purple-50/60'}`}>
                    <p className={`text-xs font-semibold uppercase tracking-widest ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>Time</p>
                    <p className={`mt-1 text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{event.time || 'TBA'}</p>
                  </div>

                  <div className={`rounded-xl border p-3 ${isDark ? 'border-purple-700/30 bg-gray-900/40' : 'border-purple-100 bg-purple-50/60'}`}>
                    <p className={`text-xs font-semibold uppercase tracking-widest ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>Location</p>
                    <p className={`mt-1 text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{event.location || 'Venue TBA'}</p>
                  </div>

                  <div className={`rounded-xl border p-3 ${isDark ? 'border-purple-700/30 bg-gray-900/40' : 'border-purple-100 bg-purple-50/60'}`}>
                    <p className={`text-xs font-semibold uppercase tracking-widest ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>Price</p>
                    <p className={`mt-1 text-base font-extrabold ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>{event.price || '—'}</p>
                  </div>
                </div>

                <p className={`mt-6 text-sm sm:text-base leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Continue to booking to select seats and confirm your tickets for this event.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <motion.button
                    type="button"
                    className="inline-flex items-center rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:from-purple-700 hover:to-pink-700 hover:shadow-purple-500/40"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/booking', { state: { event } })}
                  >
                    Book Tickets
                  </motion.button>

                  <button
                    type="button"
                    onClick={() => navigate('/events')}
                    className={`inline-flex items-center rounded-xl px-5 py-3 text-sm font-semibold transition-all ${isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
                  >
                    Browse More Events
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
