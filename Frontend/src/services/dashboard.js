import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://online-chatbot-based-ticketing-system-4whh.onrender.com';

export const fetchAdminDashboardData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/admin/dashboard`);
    return response.data;
  } catch (error) {
    console.error("Dashboard API Error:", error);
    throw new Error("Failed to load dashboard data from backend.");
  }
};

export const fetchAdminAnalyticsData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/admin/analytics`);
    return response.data;
  } catch (error) {
    console.error("Analytics API Error:", error);
    throw new Error("Failed to load analytics data from backend.");
  }
};

export const fetchTotalEarningsData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/admin/earnings`);
    return response.data;
  } catch (error) {
    console.error("Earnings API Error:", error);
    throw new Error("Failed to load earnings data from backend.");
  }
};
