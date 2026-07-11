import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

/**
 * Reusable animated button with light/dark glassmorphic variants.
 */
export function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  className = '',
  disabled = false,
  ...props
}) {
  const baseStyles = 'px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500/50 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white shadow-lg shadow-sky-500/25',
    secondary: 'bg-white/10 dark:bg-slate-900/50 border border-slate-300/30 dark:border-slate-800/80 hover:bg-white/20 dark:hover:bg-slate-900/80 text-slate-700 dark:text-slate-200 backdrop-blur-md',
    danger: 'bg-rose-500/95 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/25',
    success: 'bg-emerald-500/95 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25',
    glass: 'glassmorphism text-slate-800 dark:text-slate-100 hover:bg-white/30 dark:hover:bg-slate-800/30',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export default Button;
