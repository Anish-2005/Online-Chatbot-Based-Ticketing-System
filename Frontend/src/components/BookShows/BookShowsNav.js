import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiCreditCard } from 'react-icons/fi';
import ThemeToggleButton from '../ThemeToggleButton';

const BookShowsNav = () => {
    const navigate = useNavigate();

    return (
        <nav className="border-b border-white/10 dark:border-slate-800/50 backdrop-blur-md sticky top-0 z-50 overflow-x-clip">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 sm:h-20">
                    <button onClick={() => navigate('/')} className="flex items-center gap-2 sm:gap-3 group">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white dark:bg-slate-900 shadow-xl flex items-center justify-center p-1.5 sm:p-2 group-hover:scale-110 transition-transform">
                            <img src="/chat-ticket-logo.svg" alt="Logo" className="w-full h-full" />
                        </div>
                        <span className="text-xl sm:text-2xl font-heading font-black tracking-tight hidden xs:block">
                            Chat<span className="gradient-text">Ticket.</span>
                        </span>
                    </button>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/my-shows')}
                            className="flex items-center gap-2 px-3 py-2 sm:px-6 sm:py-2.5 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-black text-slate-700 dark:text-slate-300 shadow-xl hover:shadow-indigo-500/10 transition-all"
                            title="My Experience"
                        >
                            <FiCreditCard className="text-indigo-500 text-lg sm:text-base" />
                            <span className="hidden sm:inline">My Experience</span>
                        </motion.button>
                        <div className="h-6 sm:h-8 w-px bg-slate-200 dark:bg-slate-800 hidden xs:block" />
                        <ThemeToggleButton />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default BookShowsNav;
