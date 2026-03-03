import ThemeToggleButton from '../components/ThemeToggleButton';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeContext';
import { getShowSeatState } from '../services/bookings';

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { event } = location.state || {};
  const [ticketsLeft, setTicketsLeft] = useState(0);
  const [totalSeats, setTotalSeats] = useState(50);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatCount, setSeatCount] = useState(1);
  const [error, setError] = useState(null);
  const [loadingTickets, setLoadingTickets] = useState(false);

  useEffect(() => {
    if (event) {
      fetchTickets();
    } else {
      navigate('/booking-manual');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, navigate]);

  const fetchTickets = async () => {
    setLoadingTickets(true);
    try {
      const seatState = await getShowSeatState(event.id);
      setTicketsLeft(seatState.ticketsLeft);
      setTotalSeats(seatState.totalSeats);
      setBookedSeats(Array.isArray(seatState.bookedSeats) ? seatState.bookedSeats : []);
      setSeatCount((prev) => {
        if (seatState.ticketsLeft <= 0) {
          return 0;
        }
        return Math.min(Math.max(prev, 1), seatState.ticketsLeft);
      });
      setSelectedSeats((prev) => prev.filter((seat) => !seatState.bookedSeats.includes(seat)).slice(0, Math.max(seatState.ticketsLeft, 0)));
    } catch (fetchError) {
      console.error('Error fetching tickets:', fetchError);
      setError('Unable to fetch ticket availability right now.');
    } finally {
      setLoadingTickets(false);
    }
  };

  const handleSeatSelection = (seatNumber) => {
    setSelectedSeats((prevSeats) => {
      if (prevSeats.includes(seatNumber)) {
        return prevSeats.filter((seat) => seat !== seatNumber);
      }

      if (bookedSeats.includes(seatNumber)) {
        return prevSeats;
      }

      if (prevSeats.length >= seatCount) {
        return prevSeats;
      }

      return [...prevSeats, seatNumber];
    });

    if (error) {
      setError(null);
    }
  };

  const handleSeatCountChange = (value) => {
    const parsed = Number(value);
    const safeMax = Math.max(0, Number(ticketsLeft) || 0);
    const safeMin = safeMax === 0 ? 0 : 1;
    const boundedValue = Number.isNaN(parsed) ? safeMin : Math.min(Math.max(parsed, safeMin), safeMax);

    setSeatCount(boundedValue);
    setSelectedSeats((prev) => prev.slice(0, boundedValue));
    if (error) {
      setError(null);
    }
  };

  const handleConfirmBooking = () => {
    if (!event) {
      setError('No event selected. Please go back and choose a show.');
      return;
    }

    if (seatCount <= 0) {
      setError('No tickets available for this show right now.');
      return;
    }

    if (selectedSeats.length !== seatCount) {
      setError(`Please select ${seatCount} seat${seatCount > 1 ? 's' : ''} before continuing.`);
      return;
    }

    navigate('/paymentconfirmation', { state: { event, selectedSeats, seatCount } });
  };

  if (!event) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <div className="relative overflow-hidden">
          <div className={`pointer-events-none absolute inset-0 ${isDark ? 'bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900' : 'bg-gradient-to-br from-white via-purple-50 to-white'}`} />

          <div className="relative mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
            <div className={`w-full rounded-3xl border p-8 text-center shadow-2xl ${isDark ? 'border-purple-700/30 bg-gray-800/60' : 'border-purple-200 bg-white'}`}>
              <h1 className={`text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                No Show Selected
              </h1>
              <p className={`mt-3 text-sm sm:text-base ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Please go back to Book Shows and select an event first.
              </p>
              <button
                type="button"
                onClick={() => navigate('/bookshows')}
                className="mt-5 inline-flex items-center rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:from-purple-700 hover:to-pink-700"
              >
                Go to Book Shows
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="relative overflow-hidden">
        <div className={`pointer-events-none absolute inset-0 ${isDark ? 'bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900' : 'bg-gradient-to-br from-white via-purple-50 to-white'}`} />

        <div className="relative mx-auto w-full max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pt-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <motion.button
              onClick={() => navigate('/booking-manual', { state: { event } })}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className={`inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${isDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
            >
              ← Back to Details
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
              Seat Selection
              <span className={`block ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {event.title}
              </span>
            </h1>
            <p className={`mt-4 max-w-3xl text-base sm:text-lg font-medium leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Choose your preferred seats and confirm the number of tickets before moving to payment.
            </p>
          </motion.div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className={`rounded-3xl border p-6 shadow-2xl sm:p-8 ${isDark ? 'border-purple-700/30 bg-gray-800/60' : 'border-purple-200 bg-white'}`}
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className={`rounded-xl border p-3 ${isDark ? 'border-purple-700/30 bg-gray-900/40' : 'border-purple-100 bg-purple-50/60'}`}>
              <p className={`text-xs font-semibold uppercase tracking-widest ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>Date</p>
              <p className={`mt-1 text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{event.date || 'TBA'}</p>
            </div>
            <div className={`rounded-xl border p-3 ${isDark ? 'border-purple-700/30 bg-gray-900/40' : 'border-purple-100 bg-purple-50/60'}`}>
              <p className={`text-xs font-semibold uppercase tracking-widest ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>Time</p>
              <p className={`mt-1 text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{event.time || 'TBA'}</p>
            </div>
            <div className={`rounded-xl border p-3 ${isDark ? 'border-purple-700/30 bg-gray-900/40' : 'border-purple-100 bg-purple-50/60'}`}>
              <p className={`text-xs font-semibold uppercase tracking-widest ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>Location</p>
              <p className={`mt-1 text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{event.location || 'Venue TBA'}</p>
            </div>
            <div className={`rounded-xl border p-3 ${isDark ? 'border-purple-700/30 bg-gray-900/40' : 'border-purple-100 bg-purple-50/60'}`}>
              <p className={`text-xs font-semibold uppercase tracking-widest ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>Price</p>
              <p className={`mt-1 text-sm font-extrabold ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>{event.price || '—'}</p>
            </div>
            <div className={`rounded-xl border p-3 ${isDark ? 'border-purple-700/30 bg-gray-900/40' : 'border-purple-100 bg-purple-50/60'}`}>
              <p className={`text-xs font-semibold uppercase tracking-widest ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>Tickets Left</p>
              <p className={`mt-1 text-sm font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {loadingTickets ? 'Loading...' : ticketsLeft}
              </p>
            </div>
          </div>

          <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className={`text-lg font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Select Your Seats
                </h2>
                <p className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Selected: {selectedSeats.length}/{seatCount}
                </p>
              </div>

              <div className={`mb-4 flex flex-wrap gap-4 rounded-lg border p-3 text-xs ${isDark ? 'border-gray-700 bg-gray-900/40' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center gap-2">
                  <div className={`h-5 w-5 rounded border ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'}`}></div>
                  <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`h-5 w-5 rounded border ${isDark ? 'border-emerald-400 bg-emerald-500' : 'border-purple-600 bg-purple-600'}`}></div>
                  <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`h-5 w-5 rounded border ${isDark ? 'border-red-700 bg-gray-900 line-through' : 'border-red-400 bg-gray-300 line-through'}`}></div>
                  <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Booked (Unavailable)</span>
                </div>
              </div>

              <p className={`mb-3 text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Showing {totalSeats} total seats • {bookedSeats.length} already booked • {ticketsLeft} available
              </p>

              <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 lg:grid-cols-10">
                {[...Array(totalSeats)].map((_, index) => {
                  const seatNumber = index + 1;
                  const isSelected = selectedSeats.includes(seatNumber);
                  const isBooked = bookedSeats.includes(seatNumber);
                  const isLimitReached = selectedSeats.length >= seatCount;
                  const disableSeat = isBooked || (!isSelected && isLimitReached) || seatCount === 0;

                  return (
                    <motion.button
                      key={seatNumber}
                      type="button"
                      onClick={() => handleSeatSelection(seatNumber)}
                      disabled={disableSeat}
                      whileHover={{ scale: disableSeat ? 1 : 1.05 }}
                      whileTap={{ scale: disableSeat ? 1 : 0.95 }}
                      className={`relative h-10 rounded-lg border text-sm font-bold transition-all ${isBooked
                          ? isDark
                            ? 'border-red-700 bg-gray-900 text-gray-600 line-through cursor-not-allowed'
                            : 'border-red-400 bg-gray-300 text-gray-500 line-through cursor-not-allowed'
                          : isSelected
                            ? isDark
                              ? 'border-emerald-400 bg-emerald-500 text-white'
                              : 'border-purple-600 bg-purple-600 text-white'
                            : isDark
                              ? 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600'
                              : 'border-gray-300 bg-white text-gray-800 hover:bg-gray-50'
                        } ${isBooked ? '' : disableSeat ? 'cursor-not-allowed opacity-50' : ''}`}
                    >
                      {isBooked && (
                        <span className={`absolute inset-0 flex items-center justify-center text-xs font-black ${isDark ? 'text-red-700' : 'text-red-600'}`}>
                          ✕
                        </span>
                      )}
                      <span className={isBooked ? 'opacity-40' : ''}>{seatNumber}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className={`w-full rounded-2xl border p-4 lg:w-56 ${isDark ? 'border-purple-700/30 bg-gray-900/40' : 'border-purple-100 bg-purple-50/60'}`}>
              <label htmlFor="seatCount" className={`text-xs font-semibold uppercase tracking-widest ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>
                Number of Tickets
              </label>
              <input
                id="seatCount"
                type="number"
                value={seatCount}
                min={ticketsLeft > 0 ? '1' : '0'}
                max={Math.max(0, ticketsLeft)}
                onChange={(e) => handleSeatCountChange(e.target.value)}
                className={`mt-2 w-full rounded-xl border px-3 py-2 text-base font-semibold outline-none transition-all focus:ring-2 ${isDark ? 'border-gray-600 bg-gray-800 text-white focus:ring-purple-500' : 'border-gray-300 bg-white text-gray-900 focus:ring-purple-400'}`}
              />
              <p className={`mt-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Max available: {Math.max(0, ticketsLeft)}
              </p>
            </div>
          </div>

          {error && (
            <p className={`mt-5 rounded-xl border px-4 py-3 text-sm font-medium ${isDark ? 'border-red-500/30 bg-red-900/25 text-red-200' : 'border-red-200 bg-red-50 text-red-700'}`}>
              {error}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <motion.button
              type="button"
              onClick={handleConfirmBooking}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:from-purple-700 hover:to-pink-700 hover:shadow-purple-500/40"
            >
              Confirm Booking
            </motion.button>

            <button
              type="button"
              onClick={() => navigate('/events')}
              className={`inline-flex items-center rounded-xl px-6 py-3 text-sm font-semibold transition-all ${isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
            >
              Browse Events
            </button>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default Booking;
