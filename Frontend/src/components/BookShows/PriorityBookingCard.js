import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp } from 'react-icons/fi';

const PriorityBookingCard = () => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-4"
        >
            <div className="glass-premium p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-white/20 dark:border-slate-800/30 shadow-2xl">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-indigo-600/10 flex items-center justify-center mb-4 sm:mb-6">
                    <FiTrendingUp className="text-xl sm:text-2xl text-indigo-600" />
                </div>
                <h3 className="text-xl sm:text-2xl font-heading font-black mb-2 sm:mb-3">Priority Booking.</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-xs sm:text-sm leading-relaxed">
                    Join our Elite Circle to receive 48-hour early access to all headline exhibitions and private gallery viewings.
                </p>
                <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-slate-200 dark:border-slate-800/50 flex items-center justify-between">
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400">Available Spots</span>
                    <span className="text-indigo-500 font-black text-xs sm:text-sm">Limited Access</span>
                </div>
            </div>
        </motion.div>
    );
};

export default PriorityBookingCard;
