import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeContext';
import './Login.css';

const Login = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handleLogin = (role) => {
    if (role === 'admin') {
      navigate('/admindashboard');
    } else {
      navigate('/bookshows');
    }
  };

  return (
    <div className={`login-container ${isDark ? 'dark' : 'light'}`}>
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        <button
          onClick={() => handleLogin('admin')}
          className="login-btn admin-btn"
        >
          Admin Login
        </button>
        <button
          onClick={() => handleLogin('user')}
          className="login-btn user-btn"
        >
          User Login
        </button>
      </div>
    </div>
  );
};

export default Login;
