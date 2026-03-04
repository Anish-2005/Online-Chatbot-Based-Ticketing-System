import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../pages/ThemeContext';

const ThemeToggleButton = ({ isCollapsed = false }) => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative inline-flex items-center justify-center overflow-hidden rounded-xl font-semibold shadow-lg transition-all duration-300 ${isCollapsed ? 'w-10 h-10 p-0' : 'px-4 py-2.5 min-w-[140px]'
                } ${isDark
                    ? 'bg-gradient-to-br from-indigo-900 via-indigo-900 to-gray-900 text-yellow-300 border border-indigo-700/50 hover:border-indigo-500 hover:shadow-indigo-900/50'
                    : 'bg-gradient-to-br from-amber-50 via-orange-50 to-white text-orange-600 border border-orange-200 hover:border-orange-300 hover:shadow-orange-200/50'
                }`}
        >
            {/* Background glow effect */}
            <div className={`absolute inset-0 opacity-20 transition-opacity duration-300 group-hover:opacity-100 ${isDark ? 'bg-indigo-500 blur-xl' : 'bg-orange-400 blur-xl'
                }`} />

            <div className="relative z-10 flex items-center justify-center gap-2 w-full">
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={isDark ? 'dark' : 'light'}
                        initial={{ y: -20, opacity: 0, rotate: isDark ? -90 : 90 }}
                        animate={{ y: 0, opacity: 1, rotate: 0 }}
                        exit={{ y: 20, opacity: 0, rotate: isDark ? 90 : -90 }}
                        transition={{ duration: 0.3, type: 'spring', stiffness: 200, damping: 15 }}
                        className={`flex items-center justify-center ${isCollapsed ? '' : 'absolute left-0'}`}
                    >
                        {isDark ? (
                            <FiMoon className="w-5 h-5 drop-shadow-[0_0_8px_rgba(253,224,71,0.5)]" />
                        ) : (
                            <FiSun className="w-5 h-5 drop-shadow-[0_0_8px_rgba(234,88,12,0.5)]" />
                        )}
                    </motion.div>
                </AnimatePresence>

                {!isCollapsed && (
                    <span className="ml-6 block flex-1 text-center whitespace-nowrap tracking-wide">
                        {isDark ? 'Dark Mode' : 'Light Mode'}
                    </span>
                )}
            </div>
        </motion.button>
    );
};

export default ThemeToggleButton;
