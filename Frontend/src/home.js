import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from './pages/ThemeContext';
import { VscAccount } from 'react-icons/vsc';
import { FaTicketAlt, FaClock, FaShieldAlt, FaHeadset, FaArrowRight, FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import { FiZap, FiSmartphone, FiGlobe } from 'react-icons/fi';
import ThemeToggleButton from './components/ThemeToggleButton';

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
    <div className="text-center">
      <div className="text-4xl sm:text-5xl font-heading font-black bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
        <span ref={ref}>0</span>{suffix}
      </div>
      <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
    </div>
  );
};

/* ─── Floating orb component ──────────────────────────────── */
const FloatingOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    <div className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-[100px] animate-float" />
    <div className="absolute -bottom-[20%] -left-[10%] w-[450px] h-[450px] rounded-full bg-pink-500/10 dark:bg-pink-500/5 blur-[100px] animate-float-delayed" />
    <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full bg-blue-500/5 dark:bg-blue-500/3 blur-[80px] animate-float-slow" />
  </div>
);

/* ─── Navbar component ──────────────────────────────── */
const Navbar = ({ isDark, navigate, handleAdminLogin }) => {
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 100], [0, 1]);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundColor: isDark
          ? `rgba(15, 23, 42, ${bgOpacity.get?.() ?? 0})`
          : `rgba(255, 255, 255, ${bgOpacity.get?.() ?? 0})`,
      }}
    >
      <motion.div
        initial={false}
        style={{ backdropFilter: `blur(${bgOpacity.get?.() ? '16px' : '0px'})` }}
        className="max-w-7xl mx-auto flex items-center justify-between py-4 transition-all"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <img src="/chat-ticket-logo.svg" alt="ChatTicket" className="w-7 h-7 brightness-200" />
          </div>
          <span className="text-xl font-heading font-bold tracking-tight text-gray-900 dark:text-white">
            Chat<span className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">Ticket</span>
          </span>
        </motion.div>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          <ThemeToggleButton isCollapsed={true} />

          <motion.button
            onClick={handleAdminLogin}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${isDark
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
              }`}
          >
            <VscAccount size={16} />
            Admin
          </motion.button>

          <motion.button
            onClick={() => navigate('/login')}
            whileHover={{ scale: 1.05, boxShadow: '0 8px 24px rgba(124,58,237,.4)' }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25 transition-all"
          >
            Sign In
          </motion.button>
        </div>
      </motion.div>
    </motion.nav>
  );
};

/* ─── Feature Card ──────────────────────────────── */
const FeatureCard = ({ icon: Icon, title, description, gradient, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ y: -6, transition: { duration: 0.2 } }}
    className="group relative p-6 rounded-2xl bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50 shadow-md hover:shadow-xl transition-all duration-300"
  >
    <div className={`mb-4 w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${gradient} shadow-lg`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <h3 className="text-lg font-heading font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
    <div className={`absolute bottom-0 left-6 right-6 h-0.5 rounded-full bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
  </motion.div>
);

/* ─── Main Home Component ──────────────────────────────── */
function Home() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const handleAdminLogin = () => navigate('/admindashboard');

  const features = [
    {
      icon: FaTicketAlt,
      title: 'Instant Booking',
      description: 'Book museum tickets and shows in under 30 seconds with our streamlined checkout.',
      gradient: 'from-purple-600 to-violet-600',
    },
    {
      icon: FaHeadset,
      title: 'AI-Powered Chatbot',
      description: 'Get 24/7 intelligent ticket booking assistance powered by Dialogflow AI.',
      gradient: 'from-pink-600 to-rose-600',
    },
    {
      icon: FaShieldAlt,
      title: 'Secure Payments',
      description: 'Enterprise-grade security with Firebase Authentication and encrypted transactions.',
      gradient: 'from-emerald-600 to-teal-600',
    },
    {
      icon: FaClock,
      title: 'Real-Time Updates',
      description: 'Live seat availability, instant booking confirmations, and email receipts.',
      gradient: 'from-blue-600 to-indigo-600',
    },
    {
      icon: FiSmartphone,
      title: 'Mobile Optimized',
      description: 'Fully responsive design that works beautifully on any device, anywhere.',
      gradient: 'from-orange-500 to-amber-600',
    },
    {
      icon: FiGlobe,
      title: 'Admin Dashboard',
      description: 'Powerful analytics, show management, and revenue tracking for administrators.',
      gradient: 'from-cyan-600 to-blue-600',
    },
  ];

  return (
    <div className={`min-h-screen w-full ${isDark ? 'dark bg-gray-950' : 'bg-white'} overflow-hidden`}>
      <Navbar isDark={isDark} navigate={navigate} handleAdminLogin={handleAdminLogin} />

      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-screen flex items-center pt-20">
        <FloatingOrbs />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Hero Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8 text-center lg:text-left"
            >
              {/* Status badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700/50"
              >
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                  Live • Museum Booking Platform
                </span>
              </motion.div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-black leading-[1.08] tracking-tight">
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 dark:from-purple-400 dark:via-pink-400 dark:to-rose-400 bg-clip-text text-transparent">
                  Experience
                </span>
                <br />
                <span className={isDark ? 'text-white' : 'text-gray-900'}>
                  Unforgettable
                </span>
                <br />
                <span className={isDark ? 'text-white' : 'text-gray-900'}>
                  Moments
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed">
                AI-powered ticket booking for museums and live shows.
                Choose your seats, pay securely, and receive instant digital tickets.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <motion.button
                  onClick={() => navigate('/bookshows')}
                  whileHover={{ scale: 1.04, boxShadow: '0 20px 40px rgba(124,58,237,.4)' }}
                  whileTap={{ scale: 0.96 }}
                  className="group flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-heading font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl shadow-purple-500/25 transition-all"
                >
                  Book Now
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </motion.button>

                <motion.button
                  onClick={() => navigate('/events')}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className={`flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-heading font-bold text-lg border-2 transition-all ${isDark
                      ? 'border-gray-700 text-gray-300 hover:border-purple-500/50 hover:bg-purple-900/20'
                      : 'border-gray-200 text-gray-700 hover:border-purple-400 hover:bg-purple-50'
                    }`}
                >
                  <FiZap className="w-5 h-5" />
                  Explore Shows
                </motion.button>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-6 justify-center lg:justify-start pt-2">
                <div className="flex items-center gap-1.5">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="w-4 h-4 text-yellow-400" />
                  ))}
                  <span className="ml-2 text-sm font-semibold text-gray-600 dark:text-gray-400">4.9/5</span>
                </div>
                <div className="w-px h-5 bg-gray-300 dark:bg-gray-600" />
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Trusted by 10K+ visitors</span>
              </div>
            </motion.div>

            {/* Hero Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative hidden lg:flex items-center justify-center"
            >
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-[3rem] blur-3xl" />

              {/* Card stack illustration */}
              <div className="relative w-full max-w-md">
                {/* Back card */}
                <motion.div
                  animate={{ y: [0, -8, 0], rotate: [0, 1, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className={`absolute top-8 left-4 right-4 h-64 rounded-3xl ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'
                    } border shadow-xl`}
                />

                {/* Middle card */}
                <motion.div
                  animate={{ y: [0, -12, 0], rotate: [0, -0.5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 0.3 }}
                  className={`absolute top-4 left-2 right-2 h-64 rounded-3xl ${isDark ? 'bg-gray-800/90 border-gray-600' : 'bg-gray-50 border-gray-200'
                    } border shadow-xl`}
                />

                {/* Front card — Ticket preview */}
                <motion.div
                  animate={{ y: [0, -16, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 0.6 }}
                  className={`relative rounded-3xl p-6 border shadow-2xl ${isDark
                      ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-purple-500/30'
                      : 'bg-white border-purple-200'
                    }`}
                >
                  {/* Ticket header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <FaTicketAlt className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">E-Ticket</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">ChatTicket</p>
                      </div>
                    </div>
                    <span className="badge badge-green text-[10px]">Confirmed</span>
                  </div>

                  <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-1">
                    Ancient Civilizations Exhibition
                  </h3>
                  <div className="flex items-center gap-2 mb-4">
                    <FaMapMarkerAlt className="w-3 h-3 text-gray-400" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">National Museum, Delhi</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-5">
                    {[
                      { label: 'Date', value: 'Mar 15' },
                      { label: 'Time', value: '2:00 PM' },
                      { label: 'Seats', value: 'A4, A5' },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className={`rounded-xl p-3 text-center ${isDark ? 'bg-gray-700/50' : 'bg-purple-50'
                          }`}
                      >
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">{item.label}</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* QR section */}
                  <div className={`flex items-center justify-between p-4 rounded-2xl ${isDark ? 'bg-gray-700/30' : 'bg-gray-50'
                    }`}>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total</p>
                      <p className="text-2xl font-heading font-black text-gray-900 dark:text-white">₹500</p>
                    </div>
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${isDark ? 'bg-white' : 'bg-gray-900'
                      }`}>
                      <div className="w-12 h-12 grid grid-cols-4 gap-0.5">
                        {[...Array(16)].map((_, i) => (
                          <div
                            key={i}
                            className={`rounded-[1px] ${Math.random() > 0.4
                                ? isDark ? 'bg-gray-900' : 'bg-white'
                                : isDark ? 'bg-gray-300' : 'bg-gray-600'
                              }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── STATS SECTION ─── */}
      <section className={`py-20 border-t ${isDark ? 'border-gray-800 bg-gray-950' : 'border-gray-100 bg-gray-50/50'}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem value={10000} suffix="+" label="Tickets Sold" />
            <StatItem value={250} suffix="+" label="Shows Listed" />
            <StatItem value={50} suffix="+" label="Museums" />
            <StatItem value={99} suffix="%" label="Satisfaction" />
          </div>
        </div>
      </section>

      {/* ─── FEATURES SECTION ─── */}
      <section className={`py-24 ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge badge-purple mb-4">Features</span>
            <h2 className="text-4xl sm:text-5xl font-heading font-black text-gray-900 dark:text-white tracking-tight mt-4">
              Everything You Need for
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 dark:from-purple-400 dark:via-pink-400 dark:to-rose-400 bg-clip-text text-transparent">
                Seamless Booking
              </span>
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              From intelligent chatbot interactions to secure payments, we've built every feature to make your booking experience effortless.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} {...feature} delay={index * 0.08} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA SECTION ─── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full border-2 border-white/30" />
          <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full border-2 border-white/20" />
          <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full border-2 border-white/25" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-heading font-black text-white tracking-tight">
              Ready to Book Your Next
              <br />
              Museum Experience?
            </h2>
            <p className="mt-6 text-xl text-white/80 max-w-2xl mx-auto">
              Join thousands of satisfied visitors who trust ChatTicket for their museum and show bookings.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => navigate('/bookshows')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-heading font-bold text-lg bg-white text-purple-700 shadow-xl hover:shadow-2xl transition-all"
              >
                Start Booking
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button
                onClick={() => navigate('/login')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-heading font-bold text-lg text-white border-2 border-white/30 hover:border-white/60 hover:bg-white/10 transition-all"
              >
                Sign In
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className={`py-12 border-t ${isDark ? 'border-gray-800 bg-gray-950' : 'border-gray-100 bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand column */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                  <img src="/chat-ticket-logo.svg" alt="ChatTicket" className="w-7 h-7 brightness-200" />
                </div>
                <span className="text-xl font-heading font-bold text-gray-900 dark:text-white">
                  Chat<span className="text-purple-600 dark:text-purple-400">Ticket</span>
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">
                AI-powered chatbot-based ticketing system for museums and live shows. Book securely, get instant digital tickets.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-4">Platform</h4>
              <ul className="space-y-2.5">
                {['Book Shows', 'Events', 'My Tickets'].map((link) => (
                  <li key={link}>
                    <button
                      onClick={() => navigate(link === 'Book Shows' ? '/bookshows' : link === 'Events' ? '/events' : '/my-shows')}
                      className="text-sm text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-4">Technology</h4>
              <ul className="space-y-2.5">
                {['React', 'Firebase', 'Dialogflow AI', 'Tailwind CSS'].map((link) => (
                  <li key={link}>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{link}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={`mt-10 pt-8 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'} flex flex-col sm:flex-row items-center justify-between gap-4`}>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              © {new Date().getFullYear()} ChatTicket. Built for Smart India Hackathon.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
