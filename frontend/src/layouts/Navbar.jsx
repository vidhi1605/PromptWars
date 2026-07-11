import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudRainWind, Sun, Moon, Menu, X } from 'lucide-react';
import { useApp } from '../hooks/useApp';
import { cn } from '../utils/cn';

export function Navbar() {
  const { theme, toggleTheme } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Weather Alerts', href: '/alerts' },
    { name: 'Emergency Checklist', href: '/checklist' },
    { name: 'Travel Advisory', href: '/travel' },
    { name: 'About', href: '/about' },
  ];

  const linkStyles = ({ isActive }) =>
    cn(
      'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer',
      isActive
        ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 dark:bg-sky-500/15'
        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white'
    );

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/50 dark:border-slate-800/30 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div className="p-2 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-600 text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform duration-200">
              <CloudRainWind className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Monsoon Shield
            </span>
          </NavLink>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {navigation.map((item) => (
              <NavLink key={item.name} to={item.href} className={linkStyles}>
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Right Side Options */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200/60 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 hover:bg-white dark:hover:bg-slate-900 transition-colors cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </motion.button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl border border-slate-200/60 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-300 cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-b border-slate-200/50 dark:border-slate-800/30 bg-white/95 dark:bg-slate-950/95 overflow-hidden"
          >
            <div className="space-y-1.5 px-4 pt-2 pb-4">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'block px-4 py-2.5 rounded-xl text-base font-medium transition-colors',
                      isActive
                        ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 dark:bg-sky-500/15'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                    )
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
