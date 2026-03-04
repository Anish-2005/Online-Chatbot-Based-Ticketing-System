import ThemeToggleButton from '../components/ThemeToggleButton';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeContext';
import { processShowPayment } from '../services/bookings';
import { sendTicketEmail } from '../services/mailer';
import { FiArrowLeft, FiCreditCard, FiMail, FiCheckCircle, FiAlertCircle, FiX } from 'react-icons/fi';

const PaymentConfirmation = () => {
  const { isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { event, selectedSeats = [], seatCount = 0 } = location.state || {};
  const [email, setEmail] = useState('');
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [isRetryingEmail, setIsRetryingEmail] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('info');
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [retryEmailPayload, setRetryEmailPayload] = useState(null);
  const pricePerTicket = parseFloat((event?.price || '').toString().replace(/[^0-9.-]+/g, '')) || 0;
  const totalPrice = pricePerTicket * seatCount;

  useEffect(() => {
    if (!event) {
      setPopupMessage('No event data found. Please select a show first.');
    }
  }, [event]);

  // Email validation function
  const validateEmail = (emailValue) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError('');
    }
  };

  // Handle email input change and validate email
  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    validateEmail(emailValue);
  };

  const handlePayment = async () => {
    if (emailError || !email || !event?.id || seatCount <= 0) {
      setPopupType('error');
      setPopupMessage('Please correct the errors before proceeding.');
      return;
    }

    if (paymentCompleted) {
      setPopupType('info');
      setPopupMessage('Payment is already confirmed. Use Retry Email if you did not receive your ticket email.');
      return;
    }

    setIsPaymentProcessing(true);
    setPopupMessage('');

    try {
      const paymentResult = await processShowPayment({
        eventId: event.id,
        selectedSeats,
        seatCount,
        email,
        amount: pricePerTicket * seatCount,
        eventTitle: event.title,
      });

      setPaymentCompleted(true);

      const emailPayload = {
        to: email,
        eventTitle: event.title,
        eventDate: event.date,
        eventTime: event.time,
        eventLocation: event.location,
        selectedSeats,
        seatCount,
        amount: pricePerTicket * seatCount,
        ticketCode: paymentResult.ticketCode,
        qrData: paymentResult.qrData,
      };

      try {
        await sendTicketEmail(emailPayload);
        setRetryEmailPayload(null);
        setPopupType('success');
        setPopupMessage(`Payment successful! Ticket mailed to ${email}.`);
        setTimeout(() => {
          navigate('/bookshows', { state: { event, selectedSeats, seatCount } });
        }, 2500);
      } catch (mailError) {
        console.error('Ticket email sending failed:', mailError);
        setRetryEmailPayload(emailPayload);
        setPopupType('error');
        setPopupMessage('Payment successful, but ticket email failed. Click Retry Email to send the ticket again.');
      }
    } catch (paymentError) {
      console.error('Error processing payment:', paymentError);
      setPopupType('error');
      setPopupMessage(`Payment failed: ${paymentError.message || 'Unknown error occurred.'}`);
    } finally {
      setIsPaymentProcessing(false);
    }
  };

  const handleRetryEmail = async () => {
    if (!retryEmailPayload) {
      return;
    }

    setIsRetryingEmail(true);
    try {
      await sendTicketEmail(retryEmailPayload);
      setRetryEmailPayload(null);
      setPopupType('success');
      setPopupMessage(`Ticket mailed to ${retryEmailPayload.to}.`);
      setTimeout(() => {
        navigate('/bookshows', { state: { event, selectedSeats, seatCount } });
      }, 2000);
    } catch (retryError) {
      console.error('Retry email failed:', retryError);
      setPopupType('error');
      setPopupMessage('Retry failed. Please check mailer service and try again.');
    } finally {
      setIsRetryingEmail(false);
    }
  };

  return (
    <div className={`min-h-screen relative transition-colors duration-500 overflow-x-hidden ${isDark ? 'dark bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} selection:bg-indigo-500/30`}>
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-5%] right-[-10%] w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-indigo-600/10 rounded-full blur-[80px] sm:blur-[120px] animate-float opacity-50 sm:opacity-100" />
        <div className="absolute bottom-[20%] left-[-5%] w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-violet-600/10 rounded-full blur-[70px] sm:blur-[100px] animate-pulse-subtle opacity-50 sm:opacity-100" />
      </div>

      <div className="relative z-10 w-full">
        {/* Header Content */}
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-8">
          {/* Nav bar */}
          <div className="flex items-center justify-between gap-4 mb-10 sm:mb-16">
            <motion.button
              onClick={() => navigate('/booking', { state: { event } })}
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 sm:gap-3 px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-black text-xs sm:text-sm shadow-xl transition-all`}
            >
              <FiArrowLeft className="text-indigo-500" />
              <span className="hidden xs:inline">Back to Selection</span>
              <span className="xs:hidden">Back</span>
            </motion.button>
            <ThemeToggleButton />
          </div>

          {/* Title Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10 sm:mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-6">
              <FiCreditCard className="text-xs" />
              Secure Checkout
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-heading font-black leading-[1.1] sm:leading-[0.9] tracking-tight mb-6">
              Payment <span className="gradient-text">Verification.</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl leading-relaxed">
              Confirm your reservation for <span className="text-indigo-500 font-bold">{event?.title || 'the experience'}</span> and initialize the secure transaction.
            </p>
          </motion.div>

          <main className="pb-32">
            {!event ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-premium p-10 sm:p-20 rounded-[2rem] sm:rounded-[3rem] text-center border border-white/20 dark:border-slate-800/50 shadow-2xl"
              >
                <h3 className="text-2xl font-heading font-black mb-4">Incomplete Context</h3>
                <p className="text-slate-500 font-medium mb-8">Please initialize your booking flow from the catalog.</p>
                <button onClick={() => navigate('/bookshows')} className="px-8 py-4 rounded-xl bg-indigo-600 text-white font-black">Browse Catalog</button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="glass-premium rounded-[2.5rem] sm:rounded-[3.5rem] border border-white/20 dark:border-slate-800/50 shadow-2xl p-6 sm:p-12 lg:p-16"
              >
                {/* Summary Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
                  <div className="p-5 rounded-2xl sm:rounded-3xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Allocated Seats</span>
                    <p className="text-sm font-black text-indigo-500">{selectedSeats.join(', ') || 'None'}</p>
                  </div>
                  <div className="p-5 rounded-2xl sm:rounded-3xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Ticket Count</span>
                    <p className="text-sm font-black">{seatCount}</p>
                  </div>
                  <div className="p-5 rounded-2xl sm:rounded-3xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Unit Cost</span>
                    <p className="text-sm font-black">₹{pricePerTicket}</p>
                  </div>
                  <div className="p-5 rounded-2xl sm:rounded-3xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20">
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-2 block">Total Amount</span>
                    <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">₹{totalPrice}</p>
                  </div>
                </div>

                {/* Secure Form Area */}
                <div className="max-w-xl">
                  <div className="mb-10">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Digital Receipt Destination</label>
                    <div className="relative group">
                      <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                      <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="identity@curation.vault"
                        className="w-full pl-12 pr-5 py-4 sm:py-5 rounded-2xl bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 font-bold transition-all focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                      />
                    </div>
                    {emailError && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-xs font-bold text-rose-500">{emailError}</motion.p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <motion.button
                      whileHover={{ scale: isPaymentProcessing || paymentCompleted || !email ? 1 : 1.02 }}
                      whileTap={{ scale: isPaymentProcessing || paymentCompleted || !email ? 1 : 0.98 }}
                      onClick={handlePayment}
                      disabled={isPaymentProcessing || paymentCompleted || emailError || !email}
                      className="flex-1 py-5 rounded-2xl bg-indigo-600 text-white font-black shadow-2xl shadow-indigo-600/30 transition-all hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                    >
                      {isPaymentProcessing ? (
                        <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                      ) : (
                        <FiCheckCircle className="text-lg" />
                      )}
                      {isPaymentProcessing ? 'Encrypting...' : paymentCompleted ? 'Confirmed' : 'Authorize Payment'}
                    </motion.button>
                    <button
                      onClick={() => navigate('/booking', { state: { event } })}
                      className="px-8 py-5 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-black border border-slate-200 dark:border-slate-800 transition-colors hover:bg-slate-200 dark:hover:bg-slate-800/80 uppercase tracking-widest text-xs"
                    >
                      Modify Selection
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </main>
        </div>
      </div>

      {/* State Notifications */}
      <AnimatePresence>
        {popupMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-x-4 bottom-8 z-50 mx-auto max-w-2xl"
          >
            <div className={`glass-premium p-4 sm:p-6 rounded-2xl sm:rounded-3xl border shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 ${popupType === 'success' ? 'border-emerald-500/30 dark:bg-emerald-950/20' : 'border-indigo-500/30 dark:bg-slate-900/40'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${popupType === 'success' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-indigo-500/20 text-indigo-500'}`}>
                  {popupType === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
                </div>
                <span className="text-sm font-bold tracking-tight">{popupMessage}</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {paymentCompleted && retryEmailPayload && (
                  <button
                    onClick={handleRetryEmail}
                    disabled={isRetryingEmail}
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-rose-500 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-rose-500/20"
                  >
                    {isRetryingEmail ? '...' : 'Retry Email'}
                  </button>
                )}
                <button
                  onClick={() => setPopupMessage('')}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <FiX />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentConfirmation;
