import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiStar, FiArrowRight, FiInfo } from 'react-icons/fi';

const BookShowsHero = ({ onShowAboutMuseum }) => {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-8 text-center lg:text-left"
        >
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-4 sm:mb-6">
                <FiStar className="animate-pulse" />
                Exclusive Showings Now Live
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-black leading-[1.1] sm:leading-[0.9] tracking-tight mb-6 sm:mb-8 text-balance">
                Reserve Your <br className="hidden sm:block" />
                <span className="gradient-text">Premium Moment.</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-8 sm:mb-10 text-balance lg:text-pretty">
                Immerse yourself in world-class performances and exhibitions. Our AI-curated selection ensures you get the best seats for the most anticipated events.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <motion.button
                    onClick={() => navigate('/shows')}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-indigo-600 text-white font-black shadow-2xl shadow-indigo-600/30 flex items-center justify-center gap-3 group"
                >
                    Explore Catalog
                    <FiArrowRight className="group-hover:translate-x-1.5 transition-transform" />
                </motion.button>
                <button
                    onClick={onShowAboutMuseum}
                    className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-black text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors flex items-center justify-center gap-3"
                >
                    <FiInfo className="text-indigo-500" />
                    Museum Directory
                </button>
            </div>
        </motion.div>
    );
};

export default BookShowsHero;
