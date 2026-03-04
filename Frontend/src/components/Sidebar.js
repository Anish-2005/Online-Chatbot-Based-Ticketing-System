import ThemeToggleButton from './ThemeToggleButton';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiHome, FiBarChart2, FiDollarSign, FiTag, FiSettings,
  FiChevronRight, FiCalendar, FiChevronLeft, FiLogOut
} from 'react-icons/fi';
import { useTheme } from '../pages/ThemeContext';

const Sidebar = () => {
  const location = useLocation();
  const { isDark } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('adminSidebarCollapsed') === 'true';
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setIsMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const width = isMobile ? '0rem' : (isCollapsed ? '5.5rem' : '18rem');
    document.documentElement.style.setProperty('--admin-sidebar-width', width);
    localStorage.setItem('adminSidebarCollapsed', String(isCollapsed));
  }, [isCollapsed, isMobile]);

  const links = [
    { name: 'Insights', path: '/admindashboard', icon: FiHome },
    { name: 'Analytics', path: '/adminanalytics', icon: FiBarChart2 },
    { name: 'Schedule', path: '/adminshows', icon: FiCalendar },
    { name: 'Revenue', path: '/admintotalearning', icon: FiDollarSign },
    { name: 'Promotions', path: '/adminSpecialOffers', icon: FiTag },
    { name: 'Management', path: '/adminsettings', icon: FiSettings }
  ];

  const sidebarContent = (
    <div className={`h-[calc(100%-2rem)] m-4 glass-premium rounded-[2.5rem] border border-white/20 dark:border-slate-800/50 shadow-2xl flex flex-col overflow-hidden`}>
      {/* Header Section */}
      <div className="p-6">
        <div className={`flex items-center ${isCollapsed && !isMobile ? 'justify-center' : 'justify-between'}`}>
          <motion.div layout className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 shadow-xl flex items-center justify-center p-2 group shadow-indigo-500/10">
              <img src="/chat-ticket-logo.svg" alt="Logo" className="w-full h-full group-hover:scale-110 transition-transform" />
            </div>
            {(!isCollapsed || isMobile) && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-xl font-heading font-black tracking-tight gradient-text">ChatTicket</h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hub</p>
              </motion.div>
            )}
          </motion.div>

          {!isMobile ? (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
            >
              <FiChevronLeft className={`transition-transform duration-500 ${isCollapsed ? 'rotate-180' : ''}`} />
            </button>
          ) : (
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <FiChevronLeft />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;

          return (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => isMobile && setIsMobileOpen(false)}
              className={`flex items-center gap-4 px-4 py-4 rounded-[1.5rem] transition-all duration-300 group relative ${isActive
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/40 hover:text-indigo-500 dark:hover:text-indigo-400'
                }`}
            >
              <div className={`flex items-center justify-center ${isCollapsed && !isMobile ? 'w-full' : ''}`}>
                <Icon className={`text-xl transition-transform group-hover:scale-110 ${isActive ? 'text-white' : ''}`} />
              </div>

              {(!isCollapsed || isMobile) && (
                <span className="font-heading font-bold text-sm tracking-tight flex-1">{link.name}</span>
              )}

              {isActive && (!isCollapsed || isMobile) && (
                <motion.div layoutId="sidebar-active" className="w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-200/50 dark:border-slate-800/50">
        <div className="flex flex-col gap-2">
          <div className={`flex items-center gap-3 ${isCollapsed && !isMobile ? 'justify-center' : 'px-2'}`}>
            <ThemeToggleButton isCollapsed={isCollapsed && !isMobile} />
            {(!isCollapsed || isMobile) && <span className="text-xs font-black text-slate-400 uppercase tracking-widest flex-1">Theme</span>}
          </div>

          <Link
            to="/"
            className={`flex items-center gap-4 px-4 py-4 rounded-3xl transition-all hover:bg-rose-500/10 text-rose-500 group ${isCollapsed && !isMobile ? 'justify-center' : ''}`}
          >
            <FiLogOut className="text-xl group-hover:scale-110 transition-transform" />
            {(!isCollapsed || isMobile) && <span className="font-heading font-bold text-sm">Exit System</span>}
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button
          onClick={() => setIsMobileOpen(true)}
          className="fixed top-6 left-6 z-[60] p-3 rounded-2xl glass-premium border border-white/20 dark:border-slate-800/50 text-slate-600 dark:text-slate-300 shadow-xl"
        >
          <FiHome size={24} />
        </button>
      )}

      {/* Backdrop */}
      <AnimatePresence>
        {isMobile && isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40 transition-opacity"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transition-all duration-500 ease-[0.22, 1, 0.36, 1] 
        ${isMobile ? (isMobileOpen ? 'w-[18rem] translate-x-0' : 'w-[18rem] translate-x-[-100%]') : (isCollapsed ? 'w-[5.5rem]' : 'w-[18rem]')}`}
      >
        {sidebarContent}
      </div>
    </>
  );
};

export default Sidebar;
