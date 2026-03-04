import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiImage, FiMapPin, FiPlusCircle, FiTag, FiClock, FiCheckCircle, FiRefreshCw } from 'react-icons/fi';
import Sidebar from '../components/Sidebar';
import { useTheme } from './ThemeContext';
import { createShow, fetchShows } from '../services/shows';

const initialForm = {
  title: '',
  image: '',
  date: '',
  time: '',
  location: '',
  price: '',
  ticketsLeft: '',
  price_int: '',
};

const normalizeDate = (value) => {
  if (!value) return value;

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const ddmmyyyy = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (ddmmyyyy) {
    const [, day, month, year] = ddmmyyyy;
    return `${year}-${month}-${day}`;
  }

  return value;
};

const AdminManageShows = () => {
  const { isDark } = useTheme();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [loadingShows, setLoadingShows] = useState(true);
  const [shows, setShows] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadShows();
  }, []);

  const loadShows = async () => {
    setLoadingShows(true);
    try {
      const data = await fetchShows();
      setShows(Array.isArray(data) ? data : []);
    } catch (fetchError) {
      setError(fetchError.message || 'Unable to load shows.');
    } finally {
      setLoadingShows(false);
    }
  };

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const payload = {
        ...form,
        date: normalizeDate(form.date),
        ticketsLeft: Number(form.ticketsLeft),
        price_int: Number(form.price_int),
      };

      await createShow(payload);
      await loadShows();
      setForm(initialForm);
      setSuccess('Show added successfully. It is now available in Book Shows.');
    } catch (submitError) {
      setError(submitError.message || 'Failed to add show.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex min-h-screen ${isDark ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Sidebar />

      <div className="flex-1 p-8 transition-all duration-300" style={{ marginLeft: 'var(--admin-sidebar-width, 16rem)' }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-2">
            <div>
              <h1 className="text-5xl font-heading font-bold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent leading-tight tracking-tight mb-2">
                Manage Shows
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 font-medium leading-relaxed max-w-3xl">
                Add new shows that users can see and book from the Book Shows page.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={loadShows}
                disabled={loadingShows}
                className={`group relative px-5 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 text-base ${isDark ? 'bg-gray-800 text-gray-100 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'} disabled:opacity-60`}
              >
                <span className="flex items-center gap-2 font-medium">
                  <FiRefreshCw className={`${loadingShows ? 'animate-spin' : ''}`} />
                  Refresh
                </span>
              </button>
            </div>
          </div>
        </motion.div>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`rounded-xl border p-4 ${isDark ? 'border-gray-700 bg-gray-800/70' : 'border-gray-200 bg-white'}`}>
            <p className={`text-xs uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Total Shows</p>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{shows.length}</p>
          </div>
          <div className={`rounded-xl border p-4 ${isDark ? 'border-gray-700 bg-gray-800/70' : 'border-gray-200 bg-white'}`}>
            <p className={`text-xs uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Total Seats</p>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{shows.reduce((sum, show) => sum + Number(show.totalSeats || show.available_seats || show.ticketsLeft || 0), 0)}</p>
          </div>
          <div className={`rounded-xl border p-4 ${isDark ? 'border-gray-700 bg-gray-800/70' : 'border-gray-200 bg-white'}`}>
            <p className={`text-xs uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Upcoming Shows</p>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{shows.filter((show) => !!show.date).length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.form
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleSubmit}
            className={`lg:col-span-2 rounded-2xl shadow-lg p-6 space-y-5 ${
              isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
            }`}
          >
            <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <FiPlusCircle className="text-violet-600 dark:text-violet-400" />
              Add New Show
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="space-y-2">
                <span className="text-sm font-heading font-semibold text-gray-700 dark:text-gray-300">Title</span>
                <input value={form.title} onChange={(e) => updateField('title', e.target.value)} required className="w-full px-4 py-3 rounded-xl border bg-transparent text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-heading font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"><FiImage /> Image URL</span>
                <input value={form.image} onChange={(e) => updateField('image', e.target.value)} required className="w-full px-4 py-3 rounded-xl border bg-transparent text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-heading font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"><FiCalendar /> Date</span>
                <input value={form.date} onChange={(e) => updateField('date', e.target.value)} placeholder="DD/MM/YYYY or YYYY-MM-DD" required className="w-full px-4 py-3 rounded-xl border bg-transparent text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-heading font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"><FiClock /> Time</span>
                <input value={form.time} onChange={(e) => updateField('time', e.target.value)} required className="w-full px-4 py-3 rounded-xl border bg-transparent text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-heading font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"><FiMapPin /> Location</span>
                <input value={form.location} onChange={(e) => updateField('location', e.target.value)} required className="w-full px-4 py-3 rounded-xl border bg-transparent text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-heading font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"><FiTag /> Display Price</span>
                <input value={form.price} onChange={(e) => updateField('price', e.target.value)} required className="w-full px-4 py-3 rounded-xl border bg-transparent text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-heading font-semibold text-gray-700 dark:text-gray-300">Tickets Left</span>
                <input type="number" min="1" value={form.ticketsLeft} onChange={(e) => updateField('ticketsLeft', e.target.value)} required className="w-full px-4 py-3 rounded-xl border bg-transparent text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-heading font-semibold text-gray-700 dark:text-gray-300">Numeric Price</span>
                <input type="number" min="0" value={form.price_int} onChange={(e) => updateField('price_int', e.target.value)} required className="w-full px-4 py-3 rounded-xl border bg-transparent text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </label>
            </div>

            {error ? <p className="text-sm font-medium text-red-500">{error}</p> : null}
            {success ? <p className="text-sm font-medium text-emerald-500">{success}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className={`w-full md:w-auto px-8 py-3 rounded-xl font-heading font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 transition-all ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105'}`}
            >
              {loading ? 'Adding Show...' : 'Add Show'}
            </button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`rounded-2xl shadow-lg p-6 ${
              isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
            }`}
          >
            <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-4">Recently Available</h3>
            <div className="space-y-3 max-h-[520px] overflow-auto pr-1">
              {loadingShows ? (
                <div className={`rounded-xl p-4 border ${isDark ? 'border-gray-700 bg-gray-900/40 text-gray-300' : 'border-gray-200 bg-gray-50 text-gray-600'}`}>
                  Loading shows...
                </div>
              ) : shows.slice(0, 8).map((show, index) => (
                <div
                  key={show.id || show._id || `${show.title}-${index}`}
                  className={`rounded-xl p-4 border ${
                    isDark ? 'border-gray-700 bg-gray-900/40' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <p className="font-heading font-semibold text-gray-900 dark:text-white">{show.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{show.date} • {show.time}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{show.location}</p>
                  <p className="text-sm text-violet-600 dark:text-violet-400 font-semibold mt-1">{show.price}</p>
                  <div className="mt-2 inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                    <FiCheckCircle /> Live in Book Shows
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminManageShows;
