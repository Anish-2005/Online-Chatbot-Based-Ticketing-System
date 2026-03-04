import ThemeToggleButton from '../components/ThemeToggleButton';
import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeContext';
import { getMyPaidTickets } from '../services/bookings';
import { FiArrowLeft, FiTag, FiCalendar, FiMapPin, FiCheckCircle, FiActivity, FiCreditCard } from 'react-icons/fi';

const formatDateTime = (value) => {
  if (!value) return '—';
  const dateValue = value?.toDate ? value.toDate() : new Date(value);
  if (Number.isNaN(dateValue.getTime())) return '—';
  return dateValue.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getTicketCode = (ticket) => {
  if (ticket.ticketCode) return ticket.ticketCode;
  const baseId = (ticket.id || '').toString().slice(0, 10).toUpperCase();
  return baseId ? `TKT-${baseId}` : 'TKT-UNKNOWN';
};

const getTicketQrData = (ticket) => {
  if (ticket.qrData) return ticket.qrData;
  return JSON.stringify({
    type: 'museum_ticket',
    ticketCode: getTicketCode(ticket),
    paymentId: ticket.id,
    eventId: ticket.eventId,
    eventTitle: ticket.eventTitle,
    seatCount: ticket.seatCount,
    selectedSeats: ticket.selectedSeats,
    email: ticket.email,
  });
};

const MyShows = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadTickets = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getMyPaidTickets();
        setTickets(Array.isArray(data) ? data : []);
      } catch (ticketsError) {
        setError(ticketsError.message || 'Unable to load your tickets.');
      } finally {
        setLoading(false);
      }
    };
    loadTickets();
  }, []);

  const totalSpent = useMemo(
    () => tickets.reduce((sum, ticket) => sum + Number(ticket.amount || 0), 0),
    [tickets]
  );

  return (
    <div className={`min-h-screen relative ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} overflow-x-hidden`}>
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[100px] animate-pulse-subtle" />
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-10 pb-20">
        {/* Header Navigation */}
        <header className="flex items-center justify-between mb-16">
          <motion.button
            onClick={() => navigate('/bookshows')}
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-black text-sm shadow-xl transition-all`}
          >
            <FiArrowLeft className="text-indigo-500" />
            Back to Shows
          </motion.button>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Investment</span>
              <span className="text-xl font-heading font-black gradient-text">₹{totalSpent.toLocaleString()}</span>
            </div>
            <ThemeToggleButton />
          </div>
        </header>

        {/* Hero Title */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-[10px] font-black uppercase tracking-widest mb-6"
          >
            <FiCheckCircle />
            Your Private Experiences
          </motion.div>
          <h1 className="text-6xl sm:text-7xl font-heading font-black leading-[0.9] tracking-tight mb-6">
            My <span className="gradient-text">Experiences.</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl leading-relaxed">
            Manage your high-access tickets and past gallery viewings in your centralized digital vault.
          </p>
        </div>

        {/* Content Section */}
        <main>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-64 rounded-[2.5rem] skeleton" />)}
            </div>
          ) : error ? (
            <div className="glass-premium p-10 rounded-[2.5rem] text-center border border-red-500/20">
              <p className="text-red-500 font-black mb-4">{error}</p>
              <button onClick={() => window.location.reload()} className="px-6 py-3 rounded-xl bg-slate-900 text-white font-bold">Try Syncing Again</button>
            </div>
          ) : tickets.length === 0 ? (
            <div className="glass-premium p-20 rounded-[3rem] text-center border border-white/20">
              <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-900 mx-auto flex items-center justify-center mb-8">
                <FiTag className="text-4xl text-slate-400" />
              </div>
              <h3 className="text-3xl font-heading font-black mb-4">Your collection is empty.</h3>
              <p className="text-slate-500 font-medium mb-10">Start your journey by reserving your seat at our latest exhibitions.</p>
              <button onClick={() => navigate('/bookshows')} className="px-10 py-4 rounded-2xl bg-indigo-600 text-white font-black shadow-2xl shadow-indigo-600/30">Browse Showings</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {tickets.map((ticket, idx) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="glass-premium rounded-[2.5rem] border border-white/20 dark:border-slate-800/50 shadow-2xl overflow-hidden group"
                >
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <h3 className="text-2xl font-heading font-black mb-1 group-hover:text-indigo-500 transition-colors uppercase tracking-tight">{ticket.eventTitle || 'Exhibition Title'}</h3>
                        <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                          <FiCalendar className="text-indigo-500" />
                          {formatDateTime(ticket.createdAt)}
                        </div>
                      </div>
                      <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                        Confirmed
                      </div>
                    </div>

                    <div className="flex gap-8 items-center">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="p-3 bg-white rounded-3xl shadow-xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-800 shrink-0"
                      >
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(getTicketQrData(ticket))}`}
                          alt="Ticket QR"
                          className="w-28 h-28"
                        />
                      </motion.div>
                      <div className="space-y-4 flex-1">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Access Code</span>
                          <span className="text-lg font-heading font-black text-indigo-500">{getTicketCode(ticket)}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Seats</span>
                            <span className="text-sm font-bold">{Array.isArray(ticket.selectedSeats) ? ticket.selectedSeats.join(', ') : 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Amount</span>
                            <span className="text-sm font-bold">₹{ticket.amount}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                        <FiMapPin className="text-indigo-500" />
                        Main Exhibition Wing
                      </div>
                      <motion.button
                        whileHover={{ x: 5 }}
                        className="text-indigo-500 font-black text-xs uppercase tracking-widest flex items-center gap-2"
                      >
                        View Details
                        <FiActivity />
                      </motion.button>
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

export default MyShows;
