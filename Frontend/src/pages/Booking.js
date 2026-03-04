import ThemeToggleButton from '../components/ThemeToggleButton';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeContext';
import { getShowSeatState } from '../services/bookings';
import { FiArrowLeft, FiTag } from 'react-icons/fi';
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
      <div className={`min-h-screen relative transition-colors duration-500 overflow-x-hidden ${isDark ? 'dark bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
          <div className="absolute top-[-5%] right-[-10%] w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[80px]" />
        </div>
        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-4 py-10">
          <div className="glass-premium p-10 sm:p-20 rounded-[2rem] sm:rounded-[3rem] text-center border border-white/20 dark:border-slate-800/50 shadow-2xl">
            <h1 className="text-3xl font-heading font-black mb-4">No Experience Selected</h1>
            <p className="text-slate-500 font-medium mb-8">Please select an exhibition from the catalog first.</p>
            <button
              onClick={() => navigate('/bookshows')}
              className="px-8 py-4 rounded-xl sm:rounded-2xl bg-indigo-600 text-white font-black shadow-2xl"
            >
              Go to Catalog
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              onClick={() => navigate('/booking-manual', { state: { event } })}
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 sm:gap-3 px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-black text-xs sm:text-sm shadow-xl transition-all`}
            >
              <FiArrowLeft className="text-indigo-500" />
              <span className="hidden xs:inline">Back to Details</span>
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
              <FiTag className="text-xs" />
              Seat Allocation
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-heading font-black leading-[1.1] sm:leading-[0.9] tracking-tight mb-6">
              Spatial <span className="gradient-text">Mapping.</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl leading-relaxed">
              Define your physical footprint within the <span className="text-indigo-500 font-bold">{event.title}</span> experience.
            </p>
          </motion.div>

          <main className="pb-32">
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-premium rounded-[2.5rem] sm:rounded-[4rem] border border-white/20 dark:border-slate-800/50 shadow-2xl p-6 sm:p-12 lg:p-16"
            >
              {/* Event Metadata Bar */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-12 sm:mb-20">
                <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Date</span>
                  <p className="text-xs sm:text-sm font-black whitespace-nowrap">{event.date || 'TBA'}</p>
                </div>
                <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Time</span>
                  <p className="text-xs sm:text-sm font-black">{event.time || 'TBA'}</p>
                </div>
                <div className="hidden lg:block p-6 rounded-3xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Location</span>
                  <p className="text-sm font-black truncate">{event.location || 'Venue TBA'}</p>
                </div>
                <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Price</span>
                  <p className="text-xs sm:text-sm font-black text-indigo-500">{event.price || '—'}</p>
                </div>
                <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20">
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-2 block">Available</span>
                  <p className="text-xs sm:text-sm font-black">{loadingTickets ? '...' : ticketsLeft} Seats</p>
                </div>
              </div>

              <div className="flex flex-col xl:flex-row gap-12 sm:gap-20">
                {/* Seat Mapping Area */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-8 sm:mb-12">
                    <h2 className="text-xl sm:text-2xl font-heading font-black uppercase tracking-tighter">Spatial Grid</h2>
                    <div className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-800">
                      Selected: <span className="text-indigo-500">{selectedSeats.length} / {seatCount}</span>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap gap-4 sm:gap-8 mb-10 p-4 sm:p-6 rounded-2xl bg-slate-100/30 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest">
                    <div className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-md border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900" />
                      <span className="text-slate-500">Available</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-md bg-indigo-600 border-2 border-indigo-500 shadow-lg shadow-indigo-600/20" />
                      <span className="text-indigo-600 dark:text-indigo-400">Selected</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-md bg-rose-500/20 border-2 border-rose-500/30 relative flex items-center justify-center opacity-70">
                        <span className="text-rose-500">✕</span>
                      </div>
                      <span className="text-rose-400">Reserved</span>
                    </div>
                  </div>

                  {/* Grid */}
                  <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 sm:gap-4">
                    {[...Array(totalSeats)].map((_, index) => {
                      const seatNumber = index + 1;
                      const isSelected = selectedSeats.includes(seatNumber);
                      const isBooked = bookedSeats.includes(seatNumber);
                      const isLimitReached = selectedSeats.length >= seatCount;
                      const disableSeat = isBooked || (!isSelected && isLimitReached) || seatCount === 0;

                      return (
                        <motion.button
                          key={seatNumber}
                          onClick={() => handleSeatSelection(seatNumber)}
                          disabled={disableSeat}
                          whileHover={{ scale: disableSeat ? 1 : 1.1, y: disableSeat ? 0 : -2 }}
                          whileTap={{ scale: disableSeat ? 1 : 0.9 }}
                          className={`relative h-11 sm:h-14 rounded-xl border-2 font-black transition-all duration-300 text-xs sm:text-sm ${isBooked
                            ? 'border-rose-500/20 bg-rose-500/5 text-rose-500/20 cursor-not-allowed'
                            : isSelected
                              ? 'border-indigo-600 bg-indigo-600 text-white shadow-xl shadow-indigo-600/30'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-400 hover:border-indigo-500 hover:text-indigo-500'
                            } ${!isBooked && disableSeat && !isSelected ? 'opacity-40 cursor-not-allowed' : ''}`}
                        >
                          {isBooked ? '✕' : seatNumber}
                          {isSelected && <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white animate-pulse" />}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Reservation Controller */}
                <div className="xl:w-80">
                  <div className="glass-premium p-8 rounded-3xl border border-white/20 dark:border-slate-800/50 shadow-xl sticky top-8">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Reservation Control</h3>

                    <div className="space-y-8">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-3 block">Quantity Adjustment</label>
                        <div className="relative group">
                          <input
                            type="number"
                            value={seatCount}
                            min={ticketsLeft > 0 ? '1' : '0'}
                            max={Math.max(0, ticketsLeft)}
                            onChange={(e) => handleSeatCountChange(e.target.value)}
                            className="w-full bg-slate-100 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 font-black transition-all focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                          />
                          <p className="mt-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Ceiling: <span className="text-slate-600 dark:text-slate-200">{Math.max(0, ticketsLeft)} Tickets Available</span>
                          </p>
                        </div>
                      </div>

                      <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between items-end mb-8">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Total Payload</span>
                            <span className="text-3xl font-heading font-black">{selectedSeats.length} <span className="text-base text-slate-400">Seats</span></span>
                          </div>
                          <FiTag className="text-indigo-500 text-2xl mb-1" />
                        </div>

                        {error && (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold mb-6"
                          >
                            {error}
                          </motion.div>
                        )}

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleConfirmBooking}
                          className="w-full py-5 rounded-2xl bg-indigo-600 text-white font-black shadow-2xl shadow-indigo-600/30 transition-all hover:bg-indigo-500 flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                        >
                          Confirm Selection
                          <FiArrowLeft className="rotate-180" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Booking;
