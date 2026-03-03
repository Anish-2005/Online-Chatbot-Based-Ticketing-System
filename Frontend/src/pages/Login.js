import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { useTheme } from './ThemeContext';
import { useAuth } from './AuthContext';

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
      className={`min-h-screen w-full flex items-center justify-center px-4 ${
        isDark
          ? 'bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900'
          : 'bg-gradient-to-br from-white via-purple-50 to-white'
      }`}
    >
      <div
        className={`w-full max-w-md rounded-2xl border shadow-2xl p-8 ${
          isDark
            ? 'bg-gray-900/90 border-purple-900/40'
            : 'bg-white/95 border-purple-100'
        }`}
      >
        <h1 className="text-3xl font-heading font-bold tracking-tight text-gray-900 dark:text-white text-center">
          Sign In
        </h1>
        <p className="mt-2 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
          Continue securely with Firebase Authentication
        </p>

        <button
          onClick={handleGoogleLogin}
          disabled={isSubmitting}
          className={`mt-8 w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl font-heading font-semibold text-base transition-all border ${
            isDark
              ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700'
              : 'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
          } ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          <FcGoogle className="w-6 h-6" />
          {isSubmitting ? 'Signing in...' : 'Continue with Google'}
        </button>

        {error ? (
          <p className="mt-4 text-sm text-red-500 font-medium text-center">{error}</p>
        ) : null}
      </div>
    </div>
  );
};

export default Login;
