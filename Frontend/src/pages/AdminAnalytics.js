import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import { useTheme } from './ThemeContext';
import './AdminAnalytics.css';

const AdminAnalyticsPage = ({ role }) => {
  const { isDark, toggleTheme } = useTheme();
  const [ticketData, setTicketData] = useState([]);
  const [profit, setEarningsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch ticket analytics data from FastAPI
  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        const response = await fetch('https://online-chatbot-based-ticketing-system-4whh.onrender.com/tickets-analytics');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setTicketData(data);  // Assuming data is in the format [{ name: ..., tickets: ..., resolutionTime: ... }]
      } catch (error) {
        console.error('Error fetching ticket data:', error);
      }
    };

    const fetchEarningsData = async () => {
      try {
        const response = await fetch('https://online-chatbot-based-ticketing-system-4whh.onrender.com/profit');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setEarningsData(data); // Save the profit data into the state
      } catch (error) {
        console.error('Error fetching earnings data:', error);
      }
    };

    fetchTicketData();
    fetchEarningsData();
  }, []);

  const chartStyles = {
    gridStroke: isDark ? '#2D3436' : '#E8E8F0',
    textColor: isDark ? '#E2E8F0' : '#2D3436',
    tooltipBg: isDark ? '#1C1C2E' : '#FFFFFF',
    tooltipBorder: isDark ? '#6C5CE7' : '#A29BFE'
  };

  return (
    <div className={`admin-analytics-container ${isDark ? 'dark' : 'light'}`}>
      {/* Sidebar */}
      <Sidebar role={role} />

      {/* Main Content */}
      <div className="analytics-main-content">
        {/* Header Section */}
        <motion.div
          className="analytics-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="header-content">
            <h1 className="analytics-title">Admin Analytics Dashboard</h1>
            <p className="analytics-subtitle">Real-time performance metrics and insights</p>
          </div>
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
          >
            {isDark ? '☀️ Light' : '🌙 Dark'}
          </button>
        </motion.div>

        {/* Charts Grid */}
        <div className="charts-grid">
          {/* Ticket Analytics Chart */}
          <motion.div
            className="chart-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          >
            <div className="chart-header">
              <h2 className="chart-title">Ticket Performance</h2>
              <p className="chart-description">Ticket distribution and resolution times</p>
            </div>
            {loading ? (
              <div className="chart-loading">Loading data...</div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <LineChart
                  data={ticketData}
                  margin={{ top: 15, right: 30, left: 0, bottom: 15 }}
                >
                  <CartesianGrid 
                    strokeDasharray="4 4" 
                    stroke={chartStyles.gridStroke}
                    opacity={0.6}
                  />
                  <XAxis 
                    dataKey="name"
                    stroke={chartStyles.textColor}
                    style={{ fontSize: '12px', fontWeight: '500' }}
                  />
                  <YAxis 
                    stroke={chartStyles.textColor}
                    style={{ fontSize: '12px', fontWeight: '500' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: chartStyles.tooltipBg,
                      border: `2px solid ${chartStyles.tooltipBorder}`,
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                    labelStyle={{ color: chartStyles.textColor }}
                    cursor={false}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="line"
                  />
                  <Line
                    type="monotone"
                    dataKey="tickets"
                    stroke="#6C5CE7"
                    strokeWidth={3}
                    dot={{ fill: '#6C5CE7', r: 5 }}
                    activeDot={{ r: 7 }}
                    name="Total Tickets"
                    isAnimationActive={true}
                  />
                  <Line
                    type="monotone"
                    dataKey="resolutionTime"
                    stroke="#00B894"
                    strokeWidth={3}
                    dot={{ fill: '#00B894', r: 5 }}
                    activeDot={{ r: 7 }}
                    name="Avg Resolution"
                    isAnimationActive={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* Earnings Chart */}
          <motion.div
            className="chart-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          >
            <div className="chart-header">
              <h2 className="chart-title">Financial Overview</h2>
              <p className="chart-description">Earnings, costs, and profit analysis</p>
            </div>
            {loading ? (
              <div className="chart-loading">Loading data...</div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart
                  data={profit}
                  margin={{ top: 15, right: 30, left: 0, bottom: 15 }}
                >
                  <CartesianGrid 
                    strokeDasharray="4 4" 
                    stroke={chartStyles.gridStroke}
                    opacity={0.6}
                  />
                  <XAxis 
                    dataKey="name"
                    stroke={chartStyles.textColor}
                    style={{ fontSize: '12px', fontWeight: '500' }}
                  />
                  <YAxis 
                    stroke={chartStyles.textColor}
                    style={{ fontSize: '12px', fontWeight: '500' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: chartStyles.tooltipBg,
                      border: `2px solid ${chartStyles.tooltipBorder}`,
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                    labelStyle={{ color: chartStyles.textColor }}
                    cursor={false}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                  />
                  <Bar dataKey="earnings" fill="#6C5CE7" radius={[8, 8, 0, 0]} name="Earnings" />
                  <Bar dataKey="cost" fill="#FF6B6B" radius={[8, 8, 0, 0]} name="Costs" />
                  <Bar dataKey="profit" fill="#00B894" radius={[8, 8, 0, 0]} name="Profit" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
