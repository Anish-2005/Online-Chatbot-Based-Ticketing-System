import React from 'react';
import { motion } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiBookOpen, FiCalendar, FiCreditCard } from 'react-icons/fi';
import ThemeToggleButton from '../components/ThemeToggleButton';

const UserNavbar = () => {
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl"
    >
      <div className="glass-premium px-8 py-4 rounded-[2rem] border border-white/20 dark:border-slate-800/50 shadow-2xl flex items-center justify-between">
        {/* Logo Section */}
        <button onClick={() => navigate('/')} className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 shadow-lg flex items-center justify-center p-1.5 group-hover:scale-110 transition-transform">
            <img src="/chat-ticket-logo.svg" alt="Logo" className="w-full h-full" />
          </div>
          <span className="text-xl font-heading font-black tracking-tight hidden sm:block">
            Chat<span className="gradient-text">Ticket.</span>
          </span>
        </button>

        {/* Navigation Links */}
        <div className="flex items-center gap-1 sm:gap-6">
          <NavLink
            to="/events"
            className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black transition-all ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-500'}`}
          >
            <FiCalendar />
            <span className="hidden md:inline">Catalog</span>
          </NavLink>

          <NavLink
            to="/my-shows"
            className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black transition-all ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-500'}`}
          >
            <FiCreditCard />
            <span className="hidden md:inline">Wallet</span>
          </NavLink>

          <NavLink
            to="/booking-manual"
            className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black transition-all ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-500'}`}
          >
            <FiBookOpen />
            <span className="hidden md:inline">Guide</span>
          </NavLink>
        </div>

        {/* Utils */}
        <div className="flex items-center pl-4 border-l border-slate-200 dark:border-slate-800 ml-2">
          <ThemeToggleButton />
        </div>
      </div>
    </motion.nav>
  );
};

export default UserNavbar;
