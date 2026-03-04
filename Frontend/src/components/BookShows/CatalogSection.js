import React from 'react';
import { motion } from 'framer-motion';
import Carousel from '../../pages/Carousel';

const CatalogSection = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-premium p-5 sm:p-8 rounded-[2rem] sm:rounded-[3rem] border border-white/20 dark:border-slate-800/30 shadow-2xl overflow-hidden"
        >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 gap-4">
                <div>
                    <h2 className="text-3xl sm:text-4xl font-heading font-black tracking-tight mb-1 sm:mb-2">
                        Current <span className="gradient-text">Lineup.</span>
                    </h2>
                    <p className="text-slate-500 font-medium text-sm sm:text-base">
                        Swipe to browse the world's finest collections.
                    </p>
                </div>
                <div className="flex gap-2 self-end sm:self-auto">
                    <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-indigo-600" />
                    <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-slate-200 dark:bg-slate-800" />
                    <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-slate-200 dark:bg-slate-800" />
                </div>
            </div>
            <Carousel onSlideClick={() => { }} />
        </motion.div>
    );
};

export default CatalogSection;
