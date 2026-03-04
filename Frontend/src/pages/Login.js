import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { FaTicketAlt, FaShieldAlt, FaArrowLeft } from 'react-icons/fa';
import { useTheme } from './ThemeContext';
import { useAuth } from './AuthContext';
import ThemeToggleButton from '../components/ThemeToggleButton';

const Login = () => {
  const { isDark } = useTheme();
  const { user, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fromPath = location.state?.from?.pathname || '/bookshows';

  useEffect(() => {
    if (user) {
      navigate(fromPath, { replace: true });
    }
  }, [user, fromPath, navigate]);

  const handleGoogleLogin = async () => {
    setError('');
    setIsSubmitting(true);

    try {
      await loginWithGoogle();
      navigate(fromPath, { replace: true });
    } catch (loginError) {
      setError(loginError?.message || 'Google sign-in failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center px-4 relative overflow-hidden ${isDark ? 'bg-gray-950' : 'bg-white'
        }`}
    >
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] rounded-full bg-indigo-500/15 dark:bg-indigo-500/8 blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -bottom-[20%] -left-[15%] w-[450px] h-[450px] rounded-full bg-blue-500/15 dark:bg-blue-500/8 blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, 15, 0], y: [0, 15, 0] }}
          transition={{ duration: 22, repeat: Infinity }}
          className="absolute top-[30%] left-[20%] w-[300px] h-[300px] rounded-full bg-blue-500/8 dark:bg-blue-500/5 blur-[80px]"
        />
      </div>

      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-4">
          <motion.button
            onClick={() => navigate('/')}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${isDark
                ? 'bg-gray-800/60 text-gray-300 hover:bg-gray-700 border border-gray-700/50'
                : 'bg-white/60 text-gray-700 hover:bg-gray-100 border border-gray-200/60'
              } backdrop-blur-sm`}
          >
            <FaArrowLeft className="w-3 h-3" />
            Home
          </motion.button>
          <ThemeToggleButton isCollapsed={true} />
        </div>
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`relative z-10 w-full max-w-md rounded-3xl border p-8 sm:p-10 ${isDark
            ? 'bg-gray-900/80 border-gray-700/50 shadow-2xl shadow-indigo-500/5'
            : 'bg-white/80 border-gray-200/60 shadow-2xl shadow-indigo-500/10'
          } backdrop-blur-xl`}
      >
        {/* Logo & Brand */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center shadow-xl shadow-indigo-500/25 mb-5"
          >
            <FaTicketAlt className="w-7 h-7 text-white" />
          </motion.div>

          <h1 className="text-3xl font-heading font-black tracking-tight text-gray-900 dark:text-white">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
            Sign in to book shows and manage your tickets
          </p>
        </div>

        {/* Google login button */}
        <motion.button
          onClick={handleGoogleLogin}
          disabled={isSubmitting}
          whileHover={{ scale: isSubmitting ? 1 : 1.02, y: isSubmitting ? 0 : -2 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
          className={`w-full flex items-center justify-center gap-3 px-5 py-4 rounded-2xl font-heading font-semibold text-base transition-all border-2 ${isDark
              ? 'bg-gray-800 border-gray-600 text-white hover:bg-gray-700 hover:border-indigo-600/50'
              : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50 hover:border-indigo-400'
            } ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-gray-400 border-t-indigo-600 rounded-full animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              <FcGoogle className="w-6 h-6" />
              Continue with Google
            </>
          )}
        </motion.button>

        {/* Error message */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-sm text-red-500 dark:text-red-400 font-medium text-center bg-red-50 dark:bg-red-900/20 rounded-xl px-4 py-3 border border-red-200 dark:border-red-800/40"
          >
            {error}
          </motion.p>
        )}

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className={`flex-1 h-px ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
          <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Secured</span>
          <div className={`flex-1 h-px ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-4 text-xs text-gray-400 dark:text-gray-500">
          <div className="flex items-center gap-1.5">
            <FaShieldAlt className="w-3.5 h-3.5 text-green-500" />
            <span className="font-medium">Firebase Auth</span>
          </div>
          <div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="font-medium">256-bit SSL</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
