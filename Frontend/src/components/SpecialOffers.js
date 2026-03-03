import React from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import { useTheme } from '../pages/ThemeContext';
import { FiTag, FiCalendar, FiPercent, FiGift } from 'react-icons/fi';

const SpecialOffers = ({ role }) => {
  const { isDark, toggleTheme } = useTheme();

  const offers = [
    { 
      id: 1, 
      title: '10% off on annual subscription', 
      validUntil: '2024-12-31',
      description: 'Save big with our annual plan',
      icon: FiPercent,
      color: 'purple',
      discount: '10%'
    },
    { 
      id: 2, 
      title: 'Buy one get one free', 
      validUntil: '2024-11-15',
      description: 'Limited time offer',
      icon: FiGift,
      color: 'blue',
      discount: 'BOGO'
    },
    { 
      id: 3, 
      title: 'Early bird special', 
      validUntil: '2024-10-30',
      description: 'Book early and save 15%',
      icon: FiTag,
      color: 'green',
      discount: '15%'
    },
    { 
      id: 4, 
      title: 'Weekend exclusive', 
      validUntil: '2024-12-20',
      description: 'Special weekend pricing',
      icon: FiCalendar,
      color: 'pink',
      discount: '20%'
    },
  ];

  return (
    <div className={`flex min-h-screen ${isDark ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Sidebar role={role} />

      <div className="flex-1 ml-64 p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 dark:from-pink-400 dark:to-rose-400 bg-clip-text text-transparent mb-2">
                Special Offers & Promotions
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Exclusive deals and promotional campaigns
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-r from-pink-600 to-rose-600 text-white hover:shadow-pink-500/50 dark:from-pink-500 dark:to-rose-500"
            >
              {isDark ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offers.map((offer, index) => {
            const Icon = offer.icon;
            
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
                <div className={`absolute inset-0 bg-gradient-to-br from-${offer.color}-500/10 to-${offer.color}-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                <div className="absolute top-4 right-4">
                  <div className={`px-4 py-2 rounded-full bg-gradient-to-r from-${offer.color}-500 to-${offer.color}-600 text-white font-bold text-sm shadow-lg`}>
                    {offer.discount}
                  </div>
                </div>

                <div className="relative z-10">
                  <div className={`inline-flex p-3 rounded-xl mb-4 bg-${offer.color}-100 dark:bg-${offer.color}-900/30`}>
                    <Icon className={`w-8 h-8 text-${offer.color}-600 dark:text-${offer.color}-400`} />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {offer.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {offer.description}
                  </p>

                  <div className="flex items-center gap-2 text-sm">
                    <FiCalendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Valid until: <span className="font-semibold text-gray-900 dark:text-white">{offer.validUntil}</span>
                    </span>
                  </div>

                  <button className={`mt-6 w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-${offer.color}-500 to-${offer.color}-600 text-white hover:shadow-lg hover:shadow-${offer.color}-500/50 hover:scale-105`}>
                    Activate Offer
                  </button>
                </div>

                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-${offer.color}-500 to-${offer.color}-600`}></div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <button className={`w-full py-4 px-6 rounded-2xl font-semibold transition-all duration-300 border-2 border-dashed hover:scale-105 ${
            isDark
              ? 'border-gray-700 text-gray-400 hover:border-gray-600 hover:bg-gray-800'
              : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50'
          }`}>
            <span className="flex items-center justify-center gap-2">
              <FiTag className="w-5 h-5" />
              Add New Promotion
            </span>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default SpecialOffers;
