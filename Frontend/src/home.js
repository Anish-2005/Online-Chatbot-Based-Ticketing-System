import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from './pages/ThemeContext';
import { VscAccount } from 'react-icons/vsc';
import { FaTicketAlt, FaClock, FaShieldAlt, FaHeadset, FaArrowRight } from 'react-icons/fa';
import ThemeToggleButton from './components/ThemeToggleButton';

// Landing Page - Home Component
function Home() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const handleAdminLogin = () => {
    navigate('/admindashboard');
  };

  const features = [
    {
      icon: FaTicketAlt,
      title: 'Easy Booking',
      description: 'Book in seconds'
    },
    {
      icon: FaClock,
      title: 'Real-time Updates',
      description: 'Instant notifications'
    },
    {
      icon: FaShieldAlt,
      title: 'Secure Payment',
      description: 'Protected transactions'
    },
    {
      icon: FaHeadset,
      title: 'AI Support',
      description: '24/7 Chatbot Help'
    },
  ];

  return (
    <div className={`min-h-screen w-full ${isDark ? 'dark bg-gray-900' : 'bg-white'} flex flex-col`}>
      {/* Admin & Theme Toggle - Top Right Corner */}
      <div className="absolute top-8 right-8 z-50 flex items-center gap-4">
        <ThemeToggleButton isCollapsed={true} />

        <motion.button
          onClick={handleAdminLogin}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-2xl hover:shadow-purple-500/50"
          title="Admin Login"
        >
          <VscAccount size={24} />
        </motion.button>
      </div>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className={`flex-1 flex items-center justify-center px-4 py-32 min-h-[90vh] ${isDark
            ? 'bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900'
            : 'bg-gradient-to-br from-white via-purple-50 to-white'
          }`}
      >
        <div className="max-w-7xl w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Text */}
            <motion.div
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="space-y-6 text-center lg:text-left"
            >
              <h1 className="text-7xl sm:text-8xl font-heading font-bold leading-tight tracking-tight">
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 dark:from-purple-400 dark:via-pink-400 dark:to-rose-400 bg-clip-text text-transparent">
                  Experience
                </span>
                <br />
                <span className={isDark ? 'text-white' : 'text-gray-900'}>
                  Unforgettable Moments
                </span>
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-400 font-medium max-w-lg mx-auto lg:mx-0">
                Book museum tickets and shows with AI-powered simplicity
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <motion.button
                  onClick={() => navigate('/bookshows')}
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(108, 92, 231, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-heading font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl hover:shadow-2xl transition-all"
                >
                  Book Now
                  <FaArrowRight />
                </motion.button>

                <motion.button
                  onClick={() => navigate('/login')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-heading font-bold text-lg border-2 transition-all ${isDark
                      ? 'border-purple-600/50 text-purple-400 hover:bg-purple-600/20'
                      : 'border-purple-600 text-purple-600 hover:bg-purple-50'
                    }`}
                >
                  Sign In
                  <FaArrowRight />
                </motion.button>
              </div>
            </motion.div>

            {/* Hero Visual */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-full flex items-center justify-center min-h-96"
            >
              <div className={`absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-3xl blur-3xl ${isDark ? 'opacity-50' : 'opacity-30'}`}></div>
              <motion.svg
                viewBox="0 0 500 600"
                className="w-full h-full max-w-md relative z-10"
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 3.5, repeat: Infinity }}
              >
                <defs>
                  <linearGradient id="chatbotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6C5CE7" />
                    <stop offset="100%" stopColor="#A29BFE" />
                  </linearGradient>
                  <linearGradient id="screenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#667EEA" />
                    <stop offset="100%" stopColor="#764BA2" />
                  </linearGradient>
                  <linearGradient id="ticketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00B894" />
                    <stop offset="100%" stopColor="#55EFC4" />
                    <linearGradient id="buttonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FF6B6B" />
                      <stop offset="100%" stopColor="#FF8E8E" />
                    </linearGradient>
                  </linearGradient>
                </defs>

                {/* Laptop/Monitor Frame */}
                <g filter="drop-shadow(0 15px 35px rgba(108, 92, 231, 0.3))">
                  {/* Monitor Body */}
                  <rect x="40" y="80" width="420" height="280" fill="url(#screenGrad)" rx="16" stroke="#2D3436" strokeWidth="2" />

                  {/* Screen */}
                  <rect x="50" y="90" width="400" height="260" fill="#1A1A2E" rx="12" />

                  {/* Chatbot Avatar Circle */}
                  <circle cx="100" cy="130" r="25" fill="#00B894" filter="drop-shadow(0 4px 12px rgba(0, 184, 148, 0.4))" />
                  <text x="100" y="140" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold" fontFamily="Arial">🤖</text>

                  {/* Chatbot Message Bubble */}
                  <rect x="130" y="115" width="280" height="50" fill="#2D3436" rx="12" stroke="#00B894" strokeWidth="1.5" />
                  <text x="270" y="135" textAnchor="middle" fill="#55EFC4" fontSize="12" fontWeight="bold" fontFamily="Arial">Hi! Choose your show:</text>
                  <text x="270" y="155" textAnchor="middle" fill="#A0E7E5" fontSize="11" fontFamily="Arial">Museum Tour • Concert • Theater</text>

                  {/* Icon Grid - Shows Available */}
                  <rect x="70" y="180" width="35" height="35" fill="#FF6B6B" rx="8" />
                  <text x="87" y="202" textAnchor="middle" fill="white" fontSize="18" fontFamily="Arial">🎭</text>

                  <rect x="120" y="180" width="35" height="35" fill="#4ECDC4" rx="8" />
                  <text x="137" y="202" textAnchor="middle" fill="white" fontSize="18" fontFamily="Arial">🎨</text>

                  <rect x="170" y="180" width="35" height="35" fill="#FFD93D" rx="8" />
                  <text x="187" y="202" textAnchor="middle" fill="white" fontSize="18" fontFamily="Arial">🎪</text>

                  <rect x="220" y="180" width="35" height="35" fill="#6BCB77" rx="8" />
                  <text x="237" y="202" textAnchor="middle" fill="white" fontSize="18" fontFamily="Arial">🎵</text>

                  <rect x="270" y="180" width="35" height="35" fill="#4D96FF" rx="8" />
                  <text x="287" y="202" textAnchor="middle" fill="white" fontSize="18" fontFamily="Arial">📚</text>

                  <rect x="320" y="180" width="35" height="35" fill="#F38181" rx="8" />
                  <text x="337" y="202" textAnchor="middle" fill="white" fontSize="18" fontFamily="Arial">🎬</text>

                  {/* Booking Details Box */}
                  <rect x="70" y="230" width="350" height="70" fill="#2D3436" rx="10" stroke="#667EEA" strokeWidth="1.5" opacity="0.8" />
                  <text x="245" y="250" textAnchor="middle" fill="#A29BFE" fontSize="11" fontWeight="bold" fontFamily="Arial">🎟️ Museum Tour - Sunday 2:00 PM</text>
                  <text x="245" y="270" textAnchor="middle" fill="#FFD93D" fontSize="10" fontFamily="Arial">Price: $25 • Seats: 4</text>
                  <rect x="160" y="280" width="170" height="8" fill="#667EEA" rx="4" />
                  <text x="245" y="313" textAnchor="middle" fill="#55EFC4" fontSize="11" fontWeight="bold" fontFamily="Arial">→ Book & Pay Securely</text>
                </g>

                {/* Tickets Stack on Side */}
                <g transform="translate(0, 220)">
                  {/* Ticket 1 */}
                  <rect x="20" y="0" width="70" height="110" fill="url(#ticketGrad)" rx="8" stroke="#00B894" strokeWidth="2" filter="drop-shadow(0 8px 16px rgba(0, 184, 148, 0.3))" />
                  <text x="55" y="35" textAnchor="middle" fill="#2D3436" fontSize="12" fontWeight="bold" fontFamily="Arial">ADMIT</text>
                  <text x="55" y="55" textAnchor="middle" fill="#2D3436" fontSize="10" fontFamily="Arial">ONE</text>
                  <line x1="25" y1="65" x2="85" y2="65" stroke="#2D3436" strokeWidth="1" strokeDasharray="2,2" />
                  <text x="55" y="95" textAnchor="middle" fill="#2D3436" fontSize="7" fontFamily="Arial">✓ VALID</text>

                  {/* Ticket 2 - Rotated */}
                  <g transform="rotate(8)">
                    <rect x="95" y="15" width="70" height="110" fill="url(#ticketGrad)" rx="8" stroke="#00B894" strokeWidth="2" filter="drop-shadow(0 8px 16px rgba(0, 184, 148, 0.3))" />
                    <text x="130" y="50" textAnchor="middle" fill="#2D3436" fontSize="12" fontWeight="bold" fontFamily="Arial">ADMIT</text>
                    <text x="130" y="70" textAnchor="middle" fill="#2D3436" fontSize="10" fontFamily="Arial">ONE</text>
                    <line x1="100" y1="80" x2="160" y2="80" stroke="#2D3436" strokeWidth="1" strokeDasharray="2,2" />
                    <text x="130" y="105" textAnchor="middle" fill="#2D3436" fontSize="7" fontFamily="Arial">✓ PAID</text>
                  </g>

                  {/* Ticket 3 - More Rotated */}
                  <g transform="rotate(-6)">
                    <rect x="170" y="5" width="70" height="110" fill="url(#ticketGrad)" rx="8" stroke="#00B894" strokeWidth="2" filter="drop-shadow(0 8px 16px rgba(0, 184, 148, 0.3))" />
                    <text x="205" y="40" textAnchor="middle" fill="#2D3436" fontSize="12" fontWeight="bold" fontFamily="Arial">ADMIT</text>
                    <text x="205" y="60" textAnchor="middle" fill="#2D3436" fontSize="10" fontFamily="Arial">ONE</text>
                    <line x1="175" y1="70" x2="235" y2="70" stroke="#2D3436" strokeWidth="1" strokeDasharray="2,2" />
                    <text x="205" y="100" textAnchor="middle" fill="#2D3436" fontSize="7" fontFamily="Arial">✓ SECURED</text>
                  </g>
                </g>

                {/* Animated Chat Indicator */}
                <g transform="translate(450, 100)">
                  <circle cx="0" cy="0" r="6" fill="#FF6B6B" opacity="1">
                    <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="0" cy="0" r="12" fill="#FF6B6B" opacity="0.3">
                    <animate attributeName="r" values="6;14;6" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0;0.8" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                </g>

                {/* Bottom Status Bar */}
                <rect x="50" y="370" width="400" height="40" fill="#2D3436" rx="8" stroke="#667EEA" strokeWidth="1" opacity="0.9" />
                <text x="110" y="395" fill="#A0E7E5" fontSize="11" fontWeight="bold" fontFamily="Arial">✓ Booking Secure</text>
                <text x="280" y="395" fill="#FFD93D" fontSize="11" fontWeight="bold" fontFamily="Arial">💳 Payment Ready</text>

                {/* Keyboard */}
                <rect x="45" y="420" width="410" height="50" fill="#1A1A2E" rx="4" />
                <circle cx="65" cy="433" r="4" fill="#667EEA" />
                <circle cx="80" cy="433" r="4" fill="#667EEA" />
                <circle cx="95" cy="433" r="4" fill="#667EEA" />
                <circle cx="110" cy="433" r="4" fill="#667EEA" />
                <circle cx="125" cy="433" r="4" fill="#667EEA" />
                <circle cx="65" cy="453" r="4" fill="#667EEA" />
                <circle cx="80" cy="453" r="4" fill="#667EEA" />
                <circle cx="95" cy="453" r="4" fill="#667EEA" />
                <circle cx="110" cy="453" r="4" fill="#667EEA" />
                <circle cx="125" cy="453" r="4" fill="#667EEA" />
                <rect x="150" y="428" width="250" height="30" fill="#3A3A5C" rx="4" stroke="#667EEA" strokeWidth="0.5" />
                <text x="275" y="450" textAnchor="middle" fill="#A0E7E5" fontSize="11" fontFamily="Arial">Type your choice...</text>

                {/* Decorative Elements */}
                <circle cx="80" cy="30" r="15" fill="#FF6B6B" opacity="0.15" />
                <circle cx="420" cy="50" r="20" fill="#00B894" opacity="0.1" />
                <circle cx="450" cy="500" r="25" fill="#667EEA" opacity="0.12" />
              </motion.svg>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section - Brief */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8 }}
        className={`py-16 px-4 sm:px-6 lg:px-8 ${isDark ? 'bg-gray-950 border-t border-gray-800' : 'bg-gray-50 border-t border-gray-200'}`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className={`p-6 rounded-2xl text-center transition-all duration-300 border ${isDark
                      ? 'bg-gray-900 border-gray-800 hover:border-purple-600/50'
                      : 'bg-white border-gray-200 hover:border-purple-600/50'
                    }`}
                >
                  <div className="mb-4 flex justify-center">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/20">
                      <Icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <h3 className="text-lg font-heading font-bold text-gray-900 dark:text-white mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>
    </div>
  );
}

export default Home;
