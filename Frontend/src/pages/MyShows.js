import ThemeToggleButton from '../components/ThemeToggleButton';
import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeContext';
import { getMyPaidTickets } from '../services/bookings';

const formatDateTime = (value) => {
  if (!value) return '—';

  const dateValue = value?.toDate ? value.toDate() : new Date(value);

  if (Number.isNaN(dateValue.getTime())) {
    return '—';
  }

  return dateValue.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getTicketCode = (ticket) => {
  if (ticket.ticketCode) {
    return ticket.ticketCode;
  }

  const baseId = (ticket.id || '').toString().slice(0, 10).toUpperCase();
  return baseId ? `TKT-${baseId}` : 'TKT-UNKNOWN';
};

const getTicketQrData = (ticket) => {
  if (ticket.qrData) {
    return ticket.qrData;
  }

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
        setError(ticketsError.message || 'Unable to load your tickets right now.');
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
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="relative overflow-hidden">
        <div className={`pointer-events-none absolute inset-0 ${isDark ? 'bg-gradient-to-br from-gray-900 via-violet-900/20 to-gray-900' : 'bg-gradient-to-br from-white via-violet-50 to-white'}`} />

        <div className="relative mx-auto w-full max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pt-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <motion.button
              onClick={() => navigate('/bookshows')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className={`inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${isDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
            >
              ← Back to Book Shows
            </motion.button>
            <ThemeToggleButton />
</div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mt-8"
          >
            <h1 className={`text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl leading-[1.15] bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 ${isDark ? 'dark:from-violet-400 dark:via-indigo-400 dark:to-blue-400 bg-clip-text text-transparent' : 'bg-clip-text text-transparent'}`}>
              My Shows
              <span className={`block ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Paid Tickets
              </span>
            </h1>
            <p className={`mt-4 max-w-3xl text-base sm:text-lg font-medium leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              View all your confirmed paid bookings and revisit show details anytime.
            </p>
          </motion.div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className={`rounded-3xl border p-5 shadow-2xl sm:p-6 ${isDark ? 'border-violet-700/30 bg-gray-800/60' : 'border-violet-200 bg-white'}`}
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className={`text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Ticket History
            </h2>
            {!loading && !error && (
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isDark ? 'bg-violet-900/40 text-violet-200' : 'bg-violet-100 text-violet-700'}`}>
                  {tickets.length} paid ticket{tickets.length === 1 ? '' : 's'}
                </span>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isDark ? 'bg-emerald-900/40 text-emerald-200' : 'bg-emerald-100 text-emerald-700'}`}>
                  Total Spent: ₹{totalSpent}
                </span>
              </div>
            )}
          </div>

          {loading && (
            <div className={`rounded-2xl border p-5 text-sm font-medium ${isDark ? 'border-violet-700/30 bg-gray-900/40 text-gray-300' : 'border-violet-100 bg-violet-50/60 text-gray-700'}`}>
              Loading your paid tickets...
            </div>
          )}

          {!loading && error && (
            <div className={`rounded-2xl border p-5 text-sm font-medium ${isDark ? 'border-red-500/30 bg-red-900/20 text-red-200' : 'border-red-200 bg-red-50 text-red-700'}`}>
              {error}
            </div>
          )}

          {!loading && !error && tickets.length === 0 && (
            <div className={`rounded-2xl border p-5 text-sm font-medium ${isDark ? 'border-violet-700/30 bg-gray-900/40 text-gray-300' : 'border-violet-100 bg-violet-50/60 text-gray-700'}`}>
              You do not have any paid tickets yet. Book a show to see it here.
            </div>
          )}

          {!loading && !error && tickets.length > 0 && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {tickets.map((ticket) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className={`rounded-2xl border p-4 ${isDark ? 'border-violet-700/30 bg-gray-900/40' : 'border-violet-100 bg-violet-50/60'}`}
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <h3 className={`text-lg font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {ticket.eventTitle || 'Show'}
                    </h3>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide ${isDark ? 'bg-emerald-900/40 text-emerald-200' : 'bg-emerald-100 text-emerald-700'}`}>
                      PAID
                    </span>
                  </div>

                  <div className="mb-3 flex items-center gap-4">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(getTicketQrData(ticket))}`}
                      alt={`QR for ${getTicketCode(ticket)}`}
                      className="h-[100px] w-[100px] rounded-lg border border-violet-200 bg-white p-1"
                    />

                    <div>
                      <p className={`text-xs font-semibold uppercase tracking-widest ${isDark ? 'text-violet-300' : 'text-violet-600'}`}>
                        Ticket Code
                      </p>
                      <p className={`mt-1 text-sm font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {getTicketCode(ticket)}
                      </p>
                    </div>
                  </div>

                  <p className={`mt-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Seats: {Array.isArray(ticket.selectedSeats) ? ticket.selectedSeats.join(', ') : '—'}
                  </p>
                  <p className={`mt-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Tickets: {ticket.seatCount || 0}
                  </p>
                  <p className={`mt-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Paid On: {formatDateTime(ticket.createdAt)}
                  </p>
                  <p className={`mt-3 text-sm font-extrabold ${isDark ? 'text-violet-300' : 'text-violet-700'}`}>
                    Amount: ₹{Number(ticket.amount || 0)}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </main>
    </div>
  );
};

export default MyShows;
