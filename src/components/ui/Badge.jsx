import React from 'react';
import { cn } from '../../lib/utils';

export function Badge({ children, variant = 'default', className }) {
  const variants = {
    default: 'bg-olive-100 text-olive-800 border border-olive-200/50',
    success: 'bg-[#EAF0E5] text-[#47663B] border border-[#C5D8B8]/50', // Sage green
    warning: 'bg-gold-50 text-gold-700 border border-gold-200/50',
    danger: 'bg-[#FDF2F0] text-[#A64C3E] border border-[#F4D1CB]/50', // Soft Terracotta
  };

  return (
    <span className={cn('px-3 py-1 rounded-full text-[11px] uppercase tracking-wider font-semibold', variants[variant], className)}>
      {children}
    </span>
  );
}
