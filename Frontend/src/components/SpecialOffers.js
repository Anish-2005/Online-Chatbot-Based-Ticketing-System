import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import { useTheme } from '../pages/ThemeContext';
import { FiTag, FiCalendar, FiPercent, FiGift } from 'react-icons/fi';
import { createSpecialOffer, fetchSpecialOffers, updateSpecialOfferStatus } from '../services/offers';

const initialForm = {
  title: '',
  description: '',
  validUntil: '',
  discountLabel: '',
};

const colorSets = [
  {
    surface: 'from-purple-500/10 to-purple-600/10',
    badge: 'from-purple-500 to-purple-600',
    icon: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    button: 'from-purple-500 to-purple-600 hover:shadow-purple-500/50',
    bottom: 'from-purple-500 to-purple-600',
  },
  {
    surface: 'from-blue-500/10 to-blue-600/10',
    badge: 'from-blue-500 to-blue-600',
    icon: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    button: 'from-blue-500 to-blue-600 hover:shadow-blue-500/50',
    bottom: 'from-blue-500 to-blue-600',
  },
  {
    surface: 'from-emerald-500/10 to-emerald-600/10',
    badge: 'from-emerald-500 to-emerald-600',
    icon: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    button: 'from-emerald-500 to-emerald-600 hover:shadow-emerald-500/50',
    bottom: 'from-emerald-500 to-emerald-600',
  },
  {
    surface: 'from-pink-500/10 to-pink-600/10',
    badge: 'from-pink-500 to-pink-600',
    icon: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
    button: 'from-pink-500 to-pink-600 hover:shadow-pink-500/50',
    bottom: 'from-pink-500 to-pink-600',
  },
];

const SpecialOffers = ({ role }) => {
  const { isDark, toggleTheme } = useTheme();
  const [offers, setOffers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadOffers = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchSpecialOffers();
        setOffers(Array.isArray(data) ? data : []);
      } catch (fetchError) {
        setError(fetchError.message || 'Unable to load offers.');
      } finally {
        setLoading(false);
      }
    };

    loadOffers();
  }, []);

  const handleCreateOffer = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const created = await createSpecialOffer(form);
      setOffers((prev) => [{ ...created, isActive: true }, ...prev]);
      setForm(initialForm);
      setSuccess('Offer created and published successfully.');
    } catch (saveError) {
      setError(saveError.message || 'Failed to create offer.');
    } finally {
      setSaving(false);
    }
  };

  const toggleOffer = async (offer) => {
    const nextStatus = !offer.isActive;
    try {
      await updateSpecialOfferStatus(offer.id, nextStatus);
      setOffers((prev) => prev.map((item) => (
        item.id === offer.id ? { ...item, isActive: nextStatus } : item
      )));
    } catch (updateError) {
      setError(updateError.message || 'Failed to update offer status.');
    }
  };

  return (
    <div className={`flex min-h-screen ${isDark ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Sidebar role={role} />

      <div className="flex-1 p-8 transition-all duration-300" style={{ marginLeft: 'var(--admin-sidebar-width, 16rem)' }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-5xl font-heading font-bold bg-gradient-to-r from-pink-600 to-rose-600 dark:from-pink-400 dark:to-rose-400 bg-clip-text text-transparent mb-2 leading-tight tracking-tight">
                Special Offers & Promotions
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                Exclusive deals and promotional campaigns
              </p>
            </div>
            <div />
          </div>
        </motion.div>

        {error ? (
          <div className={`mb-6 rounded-xl border px-4 py-3 text-sm font-medium ${isDark ? 'border-red-500/30 bg-red-900/20 text-red-200' : 'border-red-200 bg-red-50 text-red-700'}`}>
            {error}
          </div>
        ) : null}
        {success ? (
          <div className={`mb-6 rounded-xl border px-4 py-3 text-sm font-medium ${isDark ? 'border-emerald-500/30 bg-emerald-900/20 text-emerald-200' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
            {success}
          </div>
        ) : null}

        <motion.form
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleCreateOffer}
          className={`mb-8 rounded-2xl p-6 shadow-lg ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}
        >
          <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-4 tracking-tight">Create Promotion</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              required
              placeholder="Offer title"
              className={`rounded-xl border px-4 py-3 text-sm ${isDark ? 'border-gray-600 bg-gray-900 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
            />
            <input
              value={form.discountLabel}
              onChange={(e) => setForm((prev) => ({ ...prev, discountLabel: e.target.value }))}
              required
              placeholder="Discount label (e.g. 20%, BOGO)"
              className={`rounded-xl border px-4 py-3 text-sm ${isDark ? 'border-gray-600 bg-gray-900 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
            />
            <input
              value={form.validUntil}
              onChange={(e) => setForm((prev) => ({ ...prev, validUntil: e.target.value }))}
              required
              placeholder="Valid until (YYYY-MM-DD)"
              className={`rounded-xl border px-4 py-3 text-sm ${isDark ? 'border-gray-600 bg-gray-900 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
            />
            <input
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              required
              placeholder="Offer description"
              className={`rounded-xl border px-4 py-3 text-sm ${isDark ? 'border-gray-600 bg-gray-900 text-white' : 'border-gray-300 bg-white text-gray-900'}`}
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="mt-4 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-105 disabled:opacity-60"
          >
            {saving ? 'Publishing...' : 'Publish Offer'}
          </button>
        </motion.form>

        {loading ? (
          <div className="flex items-center justify-center h-56">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-pink-600" />
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offers.map((offer, index) => {
            const Icon = index % 4 === 0 ? FiPercent : index % 4 === 1 ? FiGift : index % 4 === 2 ? FiTag : FiCalendar;
            const palette = colorSets[index % colorSets.length];
            
            return (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className={`group relative rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-2xl overflow-hidden ${
                  isDark 
                    ? 'bg-gray-800 border border-gray-700' 
                    : 'bg-white border border-gray-200'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${palette.surface} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                <div className="absolute top-4 right-4">
                  <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${palette.badge} text-white font-heading font-bold text-sm shadow-lg tracking-tight`}>
                    {offer.discountLabel || 'Offer'}
                  </div>
                </div>

                <div className="relative z-10">
                  <div className={`inline-flex p-3 rounded-xl mb-4 ${palette.icon}`}>
                    <Icon className="w-8 h-8" />
                  </div>

                  <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                    {offer.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 mb-4 font-medium">
                    {offer.description}
                  </p>

                  <div className="flex items-center gap-2 text-sm font-medium">
                    <FiCalendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Valid until: <span className="font-heading font-bold text-gray-900 dark:text-white">{offer.validUntil}</span>
                    </span>
                  </div>

                  <button
                    onClick={() => toggleOffer(offer)}
                    type="button"
                    className={`mt-6 w-full py-3 px-4 rounded-xl font-heading font-semibold transition-all duration-300 bg-gradient-to-r ${palette.button} text-white hover:shadow-lg hover:scale-105`}
                  >
                    {offer.isActive ? 'Deactivate Offer' : 'Activate Offer'}
                  </button>
                </div>

                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${palette.bottom}`}></div>
              </motion.div>
            );
          })}
        </div>
        )}

      </div>
    </div>
  );
};

export default SpecialOffers;
