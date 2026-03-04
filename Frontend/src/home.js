import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from './pages/ThemeContext';
import { VscAccount } from 'react-icons/vsc';
import { FaTicketAlt, FaClock, FaShieldAlt, FaHeadset, FaArrowRight, FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import { FiZap, FiSmartphone, FiGlobe, FiChevronRight, FiUser } from 'react-icons/fi';
import ThemeToggleButton from './components/ThemeToggleButton';
import { useAuth } from './pages/AuthContext';

/* ─── Animated counter hook ──────────────────────────────── */
const useCounter = (end, duration = 2000) => {
  const ref = useRef(null);

  useEffect(() => {
    let startTime;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      if (ref.current) {
        ref.current.textContent = Math.floor(eased * end).toLocaleString();
      }
      if (progress < 1) requestAnimationFrame(step);
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        requestAnimationFrame(step);
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return ref;
};

const StatItem = ({ value, suffix = '', label }) => {
  const ref = useCounter(value);
  return (
    <div className="text-center group">
      <div className="text-4xl sm:text-5xl font-heading font-black bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
        <span ref={ref}>0</span>{suffix}
      </div>
      <p className="mt-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em]">{label}</p>
    </div>
  );
};

/* ─── Navbar component ──────────────────────────────── */
const Navbar = ({ isDark, navigate, handleAdminLogin, currentUser }) => {
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 100], [0, 0.9]);
  const borderOpacity = useTransform(scrollY, [0, 100], [0, 0.1]);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 border-b transition-all duration-300"
      style={{
        backgroundColor: isDark
          ? `rgba(2, 6, 23, ${bgOpacity.get?.() ?? 0})`
          : `rgba(255, 255, 255, ${bgOpacity.get?.() ?? 0})`,
        borderColor: isDark
          ? `rgba(30, 41, 59, ${borderOpacity.get?.() ?? 0})`
          : `rgba(226, 232, 240, ${borderOpacity.get?.() ?? 0})`,
        backdropFilter: `blur(${scrollY.get?.() > 20 ? '12px' : '0px'})`
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-20">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <img src="/chat-ticket-logo.svg" alt="ChatTicket" className="w-10 h-10 drop-shadow-lg group-hover:scale-110 transition-transform" />
          <span className="text-2xl font-heading font-black tracking-tight text-gray-900 dark:text-white">
            Chat<span className="gradient-text">Ticket</span>
          </span>
        </motion.div>

        {/* Right controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggleButton isCollapsed={true} />

          {!currentUser ? (
            <>
              <motion.button
                onClick={handleAdminLogin}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${isDark
                  ? 'bg-slate-900/50 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
              >
                <VscAccount size={16} />
                Admin
              </motion.button>

              <motion.button
                onClick={() => navigate('/login')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-500/20 active:shadow-indigo-500/10 transition-all font-heading"
              >
                Sign In
              </motion.button>
            </>
          ) : (
            <motion.button
              onClick={() => navigate('/bookshows')}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-black bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-500/20 active:shadow-indigo-500/10 transition-all font-heading"
            >
              <FiUser className="w-4 h-4" />
              <span className="hidden sm:inline">My Experience</span>
              <span className="sm:hidden">Account</span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

/* ─── Feature Card ──────────────────────────────── */
const FeatureCard = ({ icon: Icon, title, description, gradient, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    className="group relative p-8 rounded-[2rem] bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(99,102,241,0.08)]"
  >
    <div className={`mb-6 w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${gradient} shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-500`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-3 tracking-tight">{title}</h3>
    <p className="text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed font-medium">{description}</p>

    <div className="mt-6 flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
      Learn more <FiChevronRight />
    </div>
  </motion.div>
);

/* ─── Main Home Component ──────────────────────────────── */
function Home() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { currentUser } = useAuth();


  const handleAdminLogin = () => navigate('/admindashboard');

  const features = [
    {
      icon: FaTicketAlt,
      title: 'Instant Booking',
      description: 'Book museum tickets and shows in under 30 seconds with our high-performance streamlined checkout.',
      gradient: 'from-violet-600 to-indigo-600',
    },
    {
      icon: FaHeadset,
      title: 'AI Chatbot',
      description: 'Get 24/7 intelligent ticket booking assistance powered by advanced Dialogflow conversational AI.',
      gradient: 'from-indigo-600 to-blue-500',
    },
    {
      icon: FaShieldAlt,
      title: 'Enterprise Security',
      description: 'Military-grade encryption with Firebase Auth ensuring your personal data and payments are always safe.',
      gradient: 'from-emerald-600 to-teal-500',
    },
    {
      icon: FaClock,
      title: 'Real-Time Sync',
      description: 'Live seat maps, instant booking confirmations, and automated email receipts for a fluid experience.',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: FiSmartphone,
      title: 'Universal Access',
      description: 'A pixel-perfect responsive interface that delivers a native-like experience on any modern browser.',
      gradient: 'from-cyan-500 to-blue-600',
    },
    {
      icon: FiGlobe,
      title: 'Admin Suite',
      description: 'Powerful analytical tools, revenue forecasting, and comprehensive management controls for operators.',
      gradient: 'from-slate-700 to-slate-900',
    },
  ];

  return (
    <div className={`min-h-screen w-full ${isDark ? 'dark bg-slate-950' : 'bg-white'} overflow-hidden selection:bg-indigo-500/30`}>
      <Navbar isDark={isDark} navigate={navigate} handleAdminLogin={handleAdminLogin} currentUser={currentUser} />

      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-screen flex items-center pt-24 pb-12 bg-mesh">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Hero Text */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="space-y-10 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800/50 shadow-sm shadow-indigo-500/5">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-700 dark:text-indigo-300">
                New: AI-Powered Seat Selection
              </span>
            </div>

            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-heading font-black leading-[0.95] tracking-tight">
              <span className="gradient-text pb-2 block">Premium</span>
              <span className={isDark ? 'text-white' : 'text-slate-900'}>Museum</span>
              <br />
              <span className={isDark ? 'text-white' : 'text-slate-900'}>Tickets.</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed opacity-90">
              The world's most advanced museum booking platform.
              Powered by AI, designed for elegance, built for speed.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
              <motion.button
                onClick={() => navigate('/bookshows')}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-heading font-black text-lg bg-indigo-600 text-white shadow-2xl shadow-indigo-500/30 hover:bg-indigo-700 transition-all"
              >
                Book Now
                <FaArrowRight className="group-hover:translate-x-1.5 transition-transform" />
              </motion.button>

              <motion.button
                onClick={() => navigate('/events')}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-heading font-black text-lg border-2 transition-all ${isDark
                  ? 'border-indigo-800/50 text-indigo-300 hover:bg-indigo-900/20'
                  : 'border-slate-200 text-slate-700 hover:border-indigo-200 hover:bg-slate-50'
                  }`}
              >
                <FiZap className="w-5 h-5" />
                Explore
              </motion.button>
            </div>

            {/* Trusted by row */}
            <div className="flex flex-wrap items-center gap-y-4 gap-x-8 justify-center lg:justify-start pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800" />
                  ))}
                </div>
                <span className="text-sm font-bold text-slate-600 dark:text-slate-400 ml-1">10k+ Visitors</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FaStar className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-black text-slate-900 dark:text-white">4.92 Trust Rating</span>
              </div>
            </div>
          </motion.div>

          {/* Hero Visual — Premium Ticket Card */}
          <motion.div
            initial={{ opacity: 0, rotateY: 20, rotateX: 10 }}
            animate={{ opacity: 1, rotateY: 0, rotateX: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="relative hidden lg:block perspective-1000"
          >
            <div className="relative w-full max-w-md mx-auto aspect-[3/4] rounded-[3rem] bg-gradient-to-br from-indigo-500 to-violet-600 p-px shadow-2xl">
              <div className={`w-full h-full rounded-[3rem] ${isDark ? 'bg-slate-950' : 'bg-white'} overflow-hidden relative`}>
                {/* Internal gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-transparent pointer-events-none" />

                {/* Card Content */}
                <div className="p-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-12">
                    <img src="/chat-ticket-logo.svg" alt="ChatTicket" className="w-14 h-14 drop-shadow-xl" />
                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Pass Status</p>
                      <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-wider border border-emerald-500/20">Verified</span>
                    </div>
                  </div>

                  <div className="space-y-1 mb-10">
                    <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Featured Exhibition</p>
                    <h3 className="text-4xl font-heading font-black text-slate-900 dark:text-white leading-tight">Masterpieces of History.</h3>
                  </div>

                  <div className="flex gap-4 mb-auto">
                    <div className="flex-1 p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Visitor Count</p>
                      <p className="text-xl font-black text-slate-900 dark:text-white">02 Tickets</p>
                    </div>
                    <div className="w-20 rounded-3xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                      <FaArrowRight className="text-2xl" />
                    </div>
                  </div>

                  {/* QR Barcode Mimic */}
                  <div className="mt-8 pt-8 border-t border-dashed border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-slate-400">Security Hash</p>
                      <p className="text-sm font-mono text-slate-600 dark:text-slate-400">#CT-992-XPA</p>
                    </div>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className={`w-1 h-8 rounded-full ${i % 2 === 0 ? 'bg-slate-900 dark:bg-white h-10' : 'bg-slate-300 dark:bg-slate-700'}`} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Float objects */}
              <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute -right-12 top-20 w-32 h-32 glass-premium rounded-3xl flex items-center justify-center shadow-2xl">
                <FaShieldAlt className="text-4xl text-indigo-500" />
              </motion.div>
              <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 6, repeat: Infinity, delay: 1 }} className="absolute -left-16 bottom-20 w-40 h-24 glass-premium rounded-3xl p-4 flex flex-col justify-center shadow-2xl">
                <p className="text-[10px] font-black uppercase text-slate-400">Success Rate</p>
                <p className="text-3xl font-heading font-black text-emerald-500">99.9%</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── STATS SECTION ─── */}
      <section className={`py-24 border-y ${isDark ? 'border-slate-900 bg-slate-950' : 'border-slate-100 bg-slate-50/30'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            <StatItem value={12500} suffix="+" label="Premium Bookings" />
            <StatItem value={480} suffix="+" label="Curated Shows" />
            <StatItem value={62} suffix="+" label="Global Museums" />
            <StatItem value={100} suffix="%" label="Safety Score" />
          </div>
        </div>
      </section>

      {/* ─── FEATURES SECTION ─── */}
      <section className="py-32 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center sm:text-left">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-24">
            <div className="max-w-2xl">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 mb-6 block">The Tech Stack</span>
              <h2 className="text-5xl sm:text-6xl font-heading font-black text-slate-900 dark:text-white tracking-tight leading-[0.95]">
                Built for the next
                <br />
                <span className="gradient-text">Generation.</span>
              </h2>
            </div>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium max-w-sm mb-2 opacity-80">
              High-performance ticketing with seamless AI integration for a frictionless journey.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} {...feature} delay={index * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA SECTION ─── */}
      <section className="relative py-40 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-violet-900/40 to-slate-950" />
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px] -mr-[400px] -mt-[400px] animate-pulse-subtle" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[100px] -ml-[300px] -mb-[300px]" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <h2 className="text-6xl sm:text-7xl lg:text-8xl font-heading font-black text-white tracking-tight leading-[0.9]">
              Start your
              <br />
              <span className="gradient-text">Journey today.</span>
            </h2>
            <p className="text-xl sm:text-2xl text-slate-300 font-medium max-w-2xl mx-auto opacity-70">
              Join the elite circle of museum enthusiasts. Experience culture with ChatTicket.
            </p>
            <div className="pt-6 flex flex-col sm:flex-row gap-5 justify-center">
              <motion.button
                onClick={() => navigate('/bookshows')}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-3 px-12 py-6 rounded-[2rem] font-heading font-black text-xl bg-white text-indigo-700 shadow-2xl transition-all"
              >
                {currentUser ? 'Go to Bookings' : 'Book Now'}
                <FaArrowRight />
              </motion.button>

              {!currentUser && (
                <motion.button
                  onClick={() => navigate('/login')}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center gap-3 px-12 py-6 rounded-[2rem] font-heading font-black text-xl text-white border-2 border-white/20 hover:bg-white/10 transition-all"
                >
                  Sign In
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className={`py-20 ${isDark ? 'bg-slate-950' : 'bg-slate-50'} border-t border-slate-200/50 dark:border-slate-900`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-16 lg:gap-24 mb-20">
            <div className="md:col-span-2 space-y-8">
              <div className="flex items-center gap-3">
                <img src="/chat-ticket-logo.svg" alt="ChatTicket" className="w-12 h-12" />
                <span className="text-2xl font-heading font-black text-slate-900 dark:text-white">
                  Chat<span className="gradient-text">Ticket</span>
                </span>
              </div>
              <p className="text-base text-slate-500 dark:text-slate-400 max-w-md leading-relaxed font-medium">
                The next generation of cultural exploration. We bridge the gap between AI and human experience using state-of-the-art conversational technology.
              </p>
            </div>

            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Company</h4>
              <ul className="space-y-4">
                {['Book Shows', 'Events', 'Privacy Policy', 'Terms of Service'].map((link) => (
                  <li key={link}>
                    <button className="text-[15px] font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors">{link}</button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Technology</h4>
              <ul className="space-y-4">
                {['React Framework', 'Firebase Node', 'Google Dialogflow', 'Vector Design'].map((link) => (
                  <li key={link}>
                    <span className="text-[15px] font-bold text-slate-500 dark:text-slate-500">{link}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={`pt-10 border-t ${isDark ? 'border-slate-900' : 'border-slate-200'} flex flex-col md:flex-row items-center justify-between gap-6`}>
            <p className="text-sm font-bold text-slate-400">
              © {new Date().getFullYear()} CHATTICKET. PROTOTYPE V4.0.0
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-wider">System Live</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;

