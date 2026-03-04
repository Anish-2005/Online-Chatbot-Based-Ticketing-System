import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import { useTheme } from './ThemeContext';
import { FiUsers, FiSearch, FiMail, FiShield, FiActivity, FiMoreVertical } from 'react-icons/fi';

const AdminUsers = () => {
    const { isDark } = useTheme();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:8000/users_info');
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={`flex min-h-screen ${isDark ? 'dark bg-slate-950' : 'bg-slate-50'} bg-mesh selection:bg-indigo-500/30`}>
            <Sidebar role="admin" />

            <main className="flex-1 p-4 sm:p-6 lg:p-10 transition-all duration-300 overflow-x-hidden min-w-0" style={{ marginLeft: 'var(--admin-sidebar-width, 0rem)' }}>
                {/* Mobile Spacer */}
                <div className="h-20 lg:hidden" />

                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-4xl sm:text-5xl font-heading font-black tracking-tight mb-2"
                        >
                            User <span className="gradient-text">Registry.</span>
                        </motion.h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">Manage platform access and user profiles</p>
                    </div>

                    <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-4">
                        <div className="relative w-full sm:w-64 group">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none text-sm font-medium transition-all shadow-sm"
                            />
                        </div>
                    </div>
                </header>

                {/* User Table Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-premium rounded-[2.5rem] overflow-hidden border border-white/20 dark:border-slate-800/50 shadow-2xl"
                >
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                                    <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-400">User Profile</th>
                                    <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Role</th>
                                    <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Status</th>
                                    <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Access History</th>
                                    <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-400"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                <AnimatePresence mode="popLayout">
                                    {loading ? (
                                        [1, 2, 3, 4, 5].map(i => (
                                            <tr key={i} className="animate-pulse">
                                                <td colSpan="5" className="p-8"><div className="h-8 bg-slate-100 dark:bg-slate-800/50 rounded-xl" /></td>
                                            </tr>
                                        ))
                                    ) : (
                                        filteredUsers.map((user, idx) => (
                                            <motion.tr
                                                key={user.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors"
                                            >
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-500/10 group-hover:scale-110 transition-transform">
                                                            {user.name?.charAt(0) || <FiUsers />}
                                                        </div>
                                                        <div>
                                                            <div className="font-heading font-bold text-slate-900 dark:text-white leading-tight">{user.name}</div>
                                                            <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5"><FiMail size={12} />{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 w-fit">
                                                        <FiShield className="text-indigo-500" size={12} />
                                                        {user.role}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={`flex items-center gap-2 text-xs font-bold ${user.status === 'Active' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`} />
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                                        <FiActivity className="text-slate-400" size={14} />
                                                        {user.lastLogin}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <button className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-300 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                                                        <FiMoreVertical />
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                        {!loading && filteredUsers.length === 0 && (
                            <div className="p-20 text-center">
                                <p className="text-slate-500 dark:text-slate-400 font-medium">No users match your criteria.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default AdminUsers;
