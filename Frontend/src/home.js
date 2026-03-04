import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from './pages/ThemeContext';
import { FiChevronRight, FiMessageSquare, FiSend } from 'react-icons/fi';
import ThemeToggleButton from './components/ThemeToggleButton';
import { useAuth } from './pages/AuthContext';

const Navbar = ({ isDark, navigate, handleAdminLogin, user }) => {
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 60], [0, 1]);
  const blurValue = useTransform(scrollY, [0, 60], [0, 16]);

  const backgroundColor = useTransform(bgOpacity, (o) =>
    isDark ? `rgba(2, 6, 23, ${o * 0.8})` : `rgba(255, 255, 255, ${o * 0.8})`
  );
  const backdropFilter = useTransform(blurValue, (v) => `blur(${v}px)`);

  return (
    <motion.nav
      style={{ backgroundColor, backdropFilter }}
      className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <img src="/chat-ticket-logo.svg" alt="ChatTicket" className="w-8 h-8 transition-transform group-hover:scale-105" />
          <span className="text-lg sm:text-xl font-heading font-black tracking-tight text-slate-900 dark:text-white">
            Chat<span className="text-indigo-500">Ticket</span>
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-6">
          <div className="scale-90 sm:scale-100 origin-right">
            <div className="hidden sm:block">
              <ThemeToggleButton isCollapsed={false} />
            </div>
            <div className="sm:hidden">
              <ThemeToggleButton isCollapsed={true} />
            </div>
          </div>

          <button
            onClick={handleAdminLogin}
            className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-500 transition-colors hidden md:block"
          >
            Terminal
          </button>

          {!user ? (
            <motion.button
              onClick={() => navigate('/login')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-5 sm:px-6 py-2 rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/10"
            >
              Enter
            </motion.button>
          ) : (
            <motion.button
              onClick={() => navigate('/bookshows')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-5 sm:px-6 py-2 rounded-full bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20"
            >
              Portal
            </motion.button>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

const ChatPreview = () => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.5 }}
    className="w-full max-w-[260px] xs:max-w-sm glass-premium rounded-[2rem] sm:rounded-[2.5rem] border border-white/20 dark:border-slate-800/50 shadow-2xl overflow-hidden pointer-events-none select-none mx-auto"
  >
    <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
        <FiMessageSquare size={18} />
      </div>
      <div>
        <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">AI Concierge</h4>
        <div className="flex items-center gap-1.5">
          <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active</span>
        </div>
      </div>
    </div>

    <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 h-[200px] xs:h-[260px] sm:h-[300px] flex flex-col justify-end">
      <div className="flex flex-col gap-2 max-w-[85%]">
        <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl rounded-bl-none bg-slate-100 dark:bg-slate-800 text-[11px] sm:text-[13px] font-medium text-slate-600 dark:text-slate-100">
          How can I help you today?
        </div>
      </div>
      <div className="flex flex-col gap-2 max-w-[80%] self-end">
        <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl rounded-br-none bg-indigo-600 dark:bg-indigo-500 text-[11px] sm:text-[13px] font-medium text-white shadow-lg shadow-indigo-500/20">
          Book a museum pass.
        </div>
      </div>
      <div className="flex flex-col gap-2 max-w-[90%]">
        <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl rounded-bl-none bg-slate-100 dark:bg-slate-800 text-[11px] sm:text-[13px] font-medium text-slate-600 dark:text-slate-100 leading-tight">
          Sure! We have 24 exhibits. Any particular era?
        </div>
      </div>
    </div>

    <div className="p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800">
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <span className="text-[10px] sm:text-xs text-slate-400 font-medium">Message concierge...</span>
        <FiSend className="text-slate-300 text-xs sm:text-base" />
      </div>
    </div>
  </motion.div>
);

function Home() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { user } = useAuth();

  const handleAdminLogin = () => {
    const enteredPin = prompt('Auth Required:');
    if (!enteredPin) return;
    const targetPin = process.env.REACT_APP_ADMIN_PIN || '1430';
    if (enteredPin.trim() === targetPin) navigate('/admindashboard');
    else alert('Access Denied.');
  };

  return (
    <div className={`min-h-[100dvh] w-full ${isDark ? 'dark bg-slate-950' : 'bg-white'} selection:bg-indigo-500/30 flex flex-col overflow-x-hidden`}>
      <Navbar isDark={isDark} navigate={navigate} handleAdminLogin={handleAdminLogin} user={user} />

      <main className="flex-1 relative flex items-center justify-center p-6 sm:p-12 lg:p-24 pt-28 lg:pt-20">
        {/* Dynamic Background */}
        <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-40 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] sm:w-[500px] sm:h-[500px] bg-indigo-500/30 rounded-full blur-[80px] sm:blur-[120px] animate-pulse-subtle" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[80vw] h-[80vw] sm:w-[400px] sm:h-[400px] bg-violet-500/20 rounded-full blur-[80px] sm:blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center lg:text-left flex flex-col items-center lg:items-start order-1"
          >
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 mb-6 block drop-shadow-sm">
              Autonomous Culture Gateway
            </span>
            <h1 className="text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-heading font-black text-slate-900 dark:text-white leading-[0.9] lg:leading-[0.85] tracking-tighter mb-8 max-w-[12ch] sm:max-w-none">
              Culture, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500 animate-gradient-x">Simplified.</span>
            </h1>
            <p className="text-[14px] sm:text-xl text-slate-500 dark:text-slate-400 font-medium max-w-lg leading-relaxed mb-10 opacity-90 px-2 sm:px-0">
              Transforming museum experience with <span className="text-indigo-500">AI-powered</span> hospitality.
              Seamless. Elegant. Intelligent.
            </p>

            <div className="flex flex-col xs:flex-row items-center gap-4 sm:gap-6 w-full xs:w-auto mb-16 lg:mb-0">
              <motion.button
                onClick={() => navigate('/bookshows')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full xs:w-auto px-10 py-4 sm:py-5 rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-xs font-black uppercase tracking-widest shadow-2xl transition-all"
              >
                Experience Now
              </motion.button>
              <button
                onClick={() => navigate('/events')}
                className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-500 transition-all flex items-center gap-2 py-3"
              >
                Explore Catalog <FiChevronRight />
              </button>
            </div>
          </motion.div>

          {/* Smart Adaptive Chat Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex justify-center items-center relative order-2 scale-90 sm:scale-100 lg:scale-105"
          >
            <ChatPreview />
            {/* Soft pulse behind chat */}
            <div className="absolute inset-0 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-[3rem] blur-2xl -z-10 animate-pulse-subtle" />
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default Home;
