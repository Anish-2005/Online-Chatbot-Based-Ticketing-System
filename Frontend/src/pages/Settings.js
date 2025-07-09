import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import './Settings.css'; // Import your CSS file

const Settings = ({ role }) => {
  const [settings, setSettings] = useState([
    { name: 'Notification', enabled: true },
    { name: 'Email Alerts', enabled: true },
    { name: 'Two-Factor Authentication (2FA)', enabled: false },
    { name: 'Auto-Logout Timer', enabled: 15 }, // Minutes
    { name: 'Language Preference', enabled: 'English' }
  ]);

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Load dark mode preference from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    // Save dark mode preference to localStorage
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleSetting = (index) => {
    const newSettings = [...settings];
    if (newSettings[index].name === 'Dark Mode') {
      setIsDarkMode(!isDarkMode);
    } else if (newSettings[index].name === 'Auto-Logout Timer') {
      const newTime = prompt("Set Auto-Logout Timer (in minutes)", newSettings[index].enabled);
      if (!isNaN(newTime) && newTime > 0) {
        newSettings[index].enabled = parseInt(newTime);
      }
    } else if (newSettings[index].name === 'Language Preference') {
      const selectedLanguage = prompt("Set Language Preference", newSettings[index].enabled);
      if (['English', 'Spanish', 'French'].includes(selectedLanguage)) {
        newSettings[index].enabled = selectedLanguage;
      }
    } else {
      newSettings[index].enabled = !newSettings[index].enabled;
    }
    setSettings(newSettings);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar role={role} isDarkMode={isDarkMode} />

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8">
        <motion.h1
          className="text-3xl font-bold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          Settings
        </motion.h1>

        <motion.div
          className={`bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-600 shadow-xl rounded-lg p-6`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <motion.ul
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
            }}
          >
            {settings.map((setting, index) => (
              <motion.li
                key={index}
                className="flex justify-between items-center mb-6"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <span
                  className={`text-lg font-semibold text-white`}
                >
                  {setting.name}
                </span>
                {setting.name === 'Auto-Logout Timer' || setting.name === 'Language Preference' ? (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="py-2 px-6 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold shadow-md"
                  >
                    {setting.enabled.toString()}
                  </motion.div>
                ) : (
                  <motion.button
                    onClick={() => toggleSetting(index)}
                    className={`py-2 px-6 rounded-lg font-semibold shadow-md transition-all duration-300 ease-in-out ${
                      setting.enabled
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-gray-400'
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {setting.enabled ? 'Enabled' : 'Disabled'}
                  </motion.button>
                )}
              </motion.li>
            ))}
          </motion.ul>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`py-2 px-4 rounded-lg font-semibold shadow-md transition-all duration-300 ease-in-out ${
              isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
