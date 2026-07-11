import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

/**
 * Reusable rounded card supporting glassmorphic backgrounds and hover effects.
 */
export function Card({
  children,
  className = '',
  hoverEffect = false,
  glass = true,
  animate = false,
  ...props
}) {
  const CardComponent = animate ? motion.div : 'div';
  const motionProps = animate
    ? {
        initial: { opacity: 0, y: 15 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35 },
        whileHover: hoverEffect ? { y: -4, transition: { duration: 0.2 } } : undefined,
      }
    : {};

  return (
    <CardComponent
      className={cn(
        'rounded-2xl overflow-hidden p-6 border',
        glass ? 'glassmorphism-card' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm',
        hoverEffect && !animate ? 'hover:shadow-md hover:border-slate-400/30 dark:hover:border-slate-500/20 transition-all duration-300' : '',
        className
      )}
      {...motionProps}
      {...props}
    >
      {children}
    </CardComponent>
  );
}

export default Card;
