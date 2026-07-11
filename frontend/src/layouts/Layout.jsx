import React from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * Responsive layout container which wraps pages with common header/footer 
 * and applies Framer Motion page entrance transitions.
 */
export function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12"
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
}

export default Layout;
