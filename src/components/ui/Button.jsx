import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

export function Button({ className, variant = 'primary', size = 'default', isLoading, children, ...props }) {
  const variants = {
    primary: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-[0_2px_10px_rgba(42,89,72,0.2)] hover:shadow-[0_4px_15px_rgba(42,89,72,0.3)]',
    secondary: 'bg-warm-beige/80 text-olive-800 hover:bg-warm-beige backdrop-blur-md',
    outline: 'border border-olive-200 text-olive-700 hover:bg-olive-50',
    ghost: 'text-olive-600 hover:bg-warm-beige/50',
    danger: 'bg-[#B05B4E] text-white hover:bg-[#9B4D41]' // Terracotta
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    default: 'px-6 py-2.5 font-medium',
    lg: 'px-8 py-3.5 text-lg font-medium'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'inline-flex items-center justify-center rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </motion.button>
  );
}
