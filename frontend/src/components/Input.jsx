import React, { forwardRef } from 'react';
import { cn } from '../utils/cn';

/**
 * Reusable text field component with React Hook Form ref-forwarding support.
 */
export const Input = forwardRef(
  (
    {
      label,
      type = 'text',
      error,
      className = '',
      placeholder = '',
      textarea = false,
      rows = 3,
      ...props
    },
    ref
  ) => {
    const inputClasses = cn(
      'w-full px-4 py-2.5 rounded-xl border bg-white/50 dark:bg-slate-900/40 backdrop-blur-sm transition-all duration-200 outline-none',
      'border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100',
      'focus:border-sky-500/80 focus:ring-2 focus:ring-sky-500/20',
      error ? 'border-rose-500 dark:border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : '',
      className
    );

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {label}
          </label>
        )}
        {textarea ? (
          <textarea
            ref={ref}
            rows={rows}
            placeholder={placeholder}
            className={inputClasses}
            {...props}
          />
        ) : (
          <input
            ref={ref}
            type={type}
            placeholder={placeholder}
            className={inputClasses}
            {...props}
          />
        )}
        {error && (
          <span className="text-xs font-medium text-rose-500 mt-0.5">
            {error.message || error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
