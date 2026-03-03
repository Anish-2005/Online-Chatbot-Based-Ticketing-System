import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import { useTheme } from './ThemeContext';
import { 
  FiBell, FiMail, FiShield, FiClock, FiGlobe, 
  FiSettings as FiSettingsIcon
} from 'react-icons/fi';

const Settings = ({ role }) => {
  const { isDark, toggleTheme } = useTheme();
  const [settings, setSettings] = useState([
    { id: 1, name: 'Notifications', enabled: true, icon: FiBell, description: 'Receive push notifications' },
    { id: 2, name: 'Email Alerts', enabled: true, icon: FiMail, description: 'Get email updates' },
    { id: 3, name: 'Two-Factor Authentication', enabled: false, icon: FiShield, description: 'Enhanced security' },
    { id: 4, name: 'Auto-Logout Timer', enabled: 15, icon: FiClock, description: 'Session timeout (min)', isCustom: true },
    { id: 5, name: 'Language Preference', enabled: 'English', icon: FiGlobe, description: 'Interface language', isCustom: true }
  ]);

  const toggleSetting = (index) => {
    const newSettings = [...settings];
    if (newSettings[index].name === 'Auto-Logout Timer') {
      const newTime = prompt("Set Auto-Logout Timer (in minutes)", newSettings[index].enabled);
      if (!isNaN(newTime) && newTime > 0) {
        newSettings[index].enabled = parseInt(newTime);
      }
    } else if (newSettings[index].name === 'Language Preference') {
      const selectedLanguage = prompt("Set Language Preference", newSettings[index].enabled);
      if (['English', 'Spanish', 'French', 'German', 'Chinese'].includes(selectedLanguage)) {
        newSettings[index].enabled = selectedLanguage;
      }
    } else {
      newSettings[index].enabled = !newSettings[index].enabled;
    }
    setSettings(newSettings);
  };

  return (
    <div className={`flex min-h-screen ${isDark ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Sidebar role={role} />

      <div className="flex-1 ml-64 p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2">
                Settings
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your account preferences and application settings
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-500/50 dark:from-blue-500 dark:to-indigo-500"
            >
              {isDark ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {settings.map((setting, index) => {
            const Icon = setting.icon;
            
            return (
              <motion.div
                key={setting.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-2xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl ${
                  isDark 
                    ? 'bg-gray-800 border border-gray-700' 
                    : 'bg-white border border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${
                        setting.enabled && !setting.isCustom
                          ? 'bg-blue-100 dark:bg-blue-900/30'
                          : 'bg-gray-100 dark:bg-gray-700'
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          setting.enabled && !setting.isCustom
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-600 dark:text-gray-400'
                        }`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {setting.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {setting.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="ml-4">
                    {setting.isCustom ? (
                      <button
                        onClick={() => toggleSetting(index)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                          isDark
                            ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {setting.enabled.toString()}
                      </button>
                    ) : (
                      <button
                        onClick={() => toggleSetting(index)}
                        className="relative"
                      >
                        <motion.div
                          animate={{
                            backgroundColor: setting.enabled 
                              ? '#3B82F6' 
                              : isDark ? '#374151' : '#E5E7EB'
                          }}
                          className="w-14 h-7 rounded-full p-1 cursor-pointer"
                        >
                          <motion.div
                            animate={{
                              x: setting.enabled ? 28 : 0
                            }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className="w-5 h-5 bg-white rounded-full shadow-md"
                          />
                        </motion.div>
                      </button>
                    )}
                  </div>
                </div>

                {!setting.isCustom && (
                  <div className="mt-4 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      setting.enabled ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                    <span className={`text-xs font-medium ${
                      setting.enabled 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {setting.enabled ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`mt-8 rounded-2xl p-6 shadow-lg ${
            isDark 
              ? 'bg-gray-800 border border-gray-700' 
              : 'bg-white border border-gray-200'
          }`}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <FiSettingsIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Advanced Settings
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Additional configuration options
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className={`p-4 rounded-xl ${
              isDark ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data Retention Policy
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                User data is retained for 90 days after account closure
              </p>
            </div>
            
            <div className={`p-4 rounded-xl ${
              isDark ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                API Access
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Manage API keys and integration settings
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
