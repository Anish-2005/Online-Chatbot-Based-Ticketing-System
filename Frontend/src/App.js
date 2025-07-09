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
import TotalEarnings from './pages/TotalEarnings';
import AdminAnalytics from './pages/AdminAnalytics';
import SpecialOffers from './components/SpecialOffers';
import BookingManualPage from './pages/BookingManualPage'
import EventsPage from './pages/EventsPage';
import BookShows from './pages/BookShows';
import Booking from './pages/Booking';
import Payment from './pages/PaymentConfirmation';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/admindashboard" element={<AdminDashboard />} />
            <Route path="/adminanalytics" element={<AdminAnalytics />} />
            <Route path="/adminusers" element={<AdminUsers />} />
            <Route path="/admintotalearning" element={<TotalEarnings />} />
            <Route path="/adminSpecialOffers" element={<SpecialOffers />} />
            <Route path="/adminsettings" element={<Settings role="admin" />} />
            <Route path="/user" element={<UserDashboard />} />
            <Route path="/user/profile" element={<UserProfile />} />
            <Route path="/user/settings" element={<Settings role="user" />} />
            <Route path="/" element={<Home />} /> {/* Add this route */}
            <Route path="/login" element={<Login />} />
            <Route path="/booking-manual" element={<BookingManualPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/bookshows" element={<BookShows />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/paymentconfirmation" element={<Payment />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
