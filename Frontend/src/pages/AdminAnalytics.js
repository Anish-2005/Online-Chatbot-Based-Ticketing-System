import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import './AdminAnalytics.css'; // Import your CSS file

const AdminAnalyticsPage = ({ role }) => {
  const [ticketData, setTicketData] = useState([]);
  const [profit, setEarningsData] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Fetch ticket analytics data from FastAPI
  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        const response = await fetch('https://fastapi-deploy-app.onrender.com/tickets-analytics');
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
        const response = await fetch('https://fastapi-deploy-app.onrender.com/profit');
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

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    document.body.classList.toggle('dark-mode', newDarkMode);
  };

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      {/* Sidebar */}
      <Sidebar role={role} />

      {/* Main Content */}
      <div className="flex-1 ml-64 p-10">
        <motion.div
          className={`shadow-xl rounded-lg p-8 mb-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-light-purple' : 'text-black'}`}>
              Admin Analytics
            </h2>
            <button
              onClick={toggleDarkMode}
              className={`py-2 px-4 rounded-lg font-semibold shadow-md transition-all duration-300 ease-in-out ${
                isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>

          {/* Ticket Analytics Section */}
          <div className="mb-10">
            <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-light-purple' : 'text-black'}`}>
              Ticket Analytics
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={ticketData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="tickets"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="resolutionTime"
                  stroke="#22c55e"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Earnings, Cost, and Profit Section */}
          <div>
            <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-light-purple' : 'text-black'}`}>
              Earnings, Cost & Profit
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={profit}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="earnings" fill="#4f46e5" radius={[10, 10, 0, 0]} />
                <Bar dataKey="cost" fill="#22c55e" radius={[10, 10, 0, 0]} />
                <Bar dataKey="profit" fill="#fbbf24" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
