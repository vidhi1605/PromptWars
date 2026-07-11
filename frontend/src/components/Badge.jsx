import React from 'react';
import { cn } from '../utils/cn';

/**
 * Reusable Badge component for categorizing status alerts.
 */
export function Badge({ children, variant = 'info', className = '' }) {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide border backdrop-blur-md';

  const variants = {
    info: 'bg-sky-100/50 text-sky-800 border-sky-200 dark:bg-sky-950/30 dark:text-sky-300 dark:border-sky-900/40',
    warning: 'bg-amber-100/50 text-amber-800 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900/40',
    danger: 'bg-rose-100/50 text-rose-800 border-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-900/40',
    success: 'bg-emerald-100/50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900/40',
  };

  return (
    <span className={cn(baseStyles, variants[variant], className)}>
      {children}
    </span>
  );
}

export default Badge;
