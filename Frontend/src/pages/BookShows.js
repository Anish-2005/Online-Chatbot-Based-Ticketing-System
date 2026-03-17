import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from './ThemeContext';
import AboutMuseum from './AboutMuseum';
import BookShowsNav from '../components/BookShows/BookShowsNav';
import BookShowsHero from '../components/BookShows/BookShowsHero';
import PriorityBookingCard from '../components/BookShows/PriorityBookingCard';
import CatalogSection from '../components/BookShows/CatalogSection';

const Bookshows = () => {
  const { isDark } = useTheme();
  const [showAboutMuseum, setShowAboutMuseum] = useState(false);

  return (
    <div className={`relative ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} overflow-x-hidden`}>
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-indigo-600/10 rounded-full blur-[80px] sm:blur-[120px] animate-float" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] bg-violet-600/10 rounded-full blur-[70px] sm:blur-[100px] animate-pulse-subtle" />
      </div>

      <div className="relative z-10">
        <BookShowsNav />

        {/* Hero & Priority Grid */}
        <header className="mx-auto max-w-7xl px-4 pt-10 sm:pt-16 pb-8 sm:pb-12 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <BookShowsHero onShowAboutMuseum={() => setShowAboutMuseum(!showAboutMuseum)} />
            <PriorityBookingCard />
          </div>
        </header>

        {/* Dynamic Catalog Section */}
        <main className="mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
          <CatalogSection />

          {/* Directory Reveal */}
          <AnimatePresence>
            {showAboutMuseum && (
              <motion.section
                initial={{ opacity: 0, height: 0, y: 20 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: 20 }}
                className="mt-8 sm:mt-12 overflow-hidden"
              >
                <div className="glass-premium p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-white/20 dark:border-slate-800/30 shadow-2xl">
                  <AboutMuseum />
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Bookshows;
