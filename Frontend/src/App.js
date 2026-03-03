import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />

              <Route path="/admindashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/adminanalytics" element={<ProtectedRoute><AdminAnalytics /></ProtectedRoute>} />
              <Route path="/adminusers" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
              <Route path="/adminshows" element={<ProtectedRoute><AdminManageShows /></ProtectedRoute>} />
              <Route path="/admintotalearning" element={<ProtectedRoute><TotalEarnings /></ProtectedRoute>} />
              <Route path="/adminSpecialOffers" element={<ProtectedRoute><SpecialOffers /></ProtectedRoute>} />
              <Route path="/adminsettings" element={<ProtectedRoute><Settings role="admin" /></ProtectedRoute>} />
              <Route path="/user" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
              <Route path="/user/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
              <Route path="/user/settings" element={<ProtectedRoute><Settings role="user" /></ProtectedRoute>} />
              <Route path="/booking-manual" element={<ProtectedRoute><BookingManualPage /></ProtectedRoute>} />
              <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
              <Route path="/bookshows" element={<ProtectedRoute><BookShows /></ProtectedRoute>} />
              <Route path="/my-shows" element={<ProtectedRoute><MyShows /></ProtectedRoute>} />
              <Route path="/booking" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
              <Route path="/paymentconfirmation" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
