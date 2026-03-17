import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Chatbot from './pages/Chatbot';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import UserDashboard from './pages/UserDashboard';
import UserProfile from './pages/UserProfile';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Home from './home'; // Import the Home component
import { ThemeProvider } from './pages/ThemeContext';
import { AuthProvider } from './pages/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import TotalEarnings from './pages/TotalEarnings';
import AdminAnalytics from './pages/AdminAnalytics';
import SpecialOffers from './components/SpecialOffers';
import BookingManualPage from './pages/BookingManualPage'
import EventsPage from './pages/EventsPage';
import BookShows from './pages/BookShows';
import Booking from './pages/Booking';
import Payment from './pages/PaymentConfirmation';
import AdminManageShows from './pages/AdminManageShows';
import MyShows from './pages/MyShows';

import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const pageVariants = {
  initial: { opacity: 0, y: 15, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.98,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
  }
};

const PageWrapper = ({ children }) => (
  <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} className="w-full h-auto flex flex-col">
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />

        {/* Protected Routes */}
        <Route path="/admindashboard" element={<ProtectedRoute><PageWrapper><AdminDashboard /></PageWrapper></ProtectedRoute>} />
        <Route path="/adminanalytics" element={<ProtectedRoute><PageWrapper><AdminAnalytics /></PageWrapper></ProtectedRoute>} />
        <Route path="/adminusers" element={<ProtectedRoute><PageWrapper><AdminUsers /></PageWrapper></ProtectedRoute>} />
        <Route path="/adminshows" element={<ProtectedRoute><PageWrapper><AdminManageShows /></PageWrapper></ProtectedRoute>} />
        <Route path="/admintotalearning" element={<ProtectedRoute><PageWrapper><TotalEarnings /></PageWrapper></ProtectedRoute>} />
        <Route path="/adminSpecialOffers" element={<ProtectedRoute><PageWrapper><SpecialOffers /></PageWrapper></ProtectedRoute>} />
        <Route path="/adminsettings" element={<ProtectedRoute><PageWrapper><Settings role="admin" /></PageWrapper></ProtectedRoute>} />
        <Route path="/user" element={<ProtectedRoute><PageWrapper><UserDashboard /></PageWrapper></ProtectedRoute>} />
        <Route path="/user/profile" element={<ProtectedRoute><PageWrapper><UserProfile /></PageWrapper></ProtectedRoute>} />
        <Route path="/user/settings" element={<ProtectedRoute><PageWrapper><Settings role="user" /></PageWrapper></ProtectedRoute>} />
        <Route path="/booking-manual" element={<ProtectedRoute><PageWrapper><BookingManualPage /></PageWrapper></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute><PageWrapper><EventsPage /></PageWrapper></ProtectedRoute>} />
        <Route path="/bookshows" element={<ProtectedRoute><PageWrapper><BookShows /></PageWrapper></ProtectedRoute>} />
        <Route path="/my-shows" element={<ProtectedRoute><PageWrapper><MyShows /></PageWrapper></ProtectedRoute>} />
        <Route path="/booking" element={<ProtectedRoute><PageWrapper><Booking /></PageWrapper></ProtectedRoute>} />
        <Route path="/paymentconfirmation" element={<ProtectedRoute><PageWrapper><Payment /></PageWrapper></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App min-h-screen bg-transparent transition-colors duration-500">
            <AnimatedRoutes />
            <Chatbot />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
