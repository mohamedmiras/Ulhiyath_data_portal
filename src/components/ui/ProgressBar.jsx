import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export function ProgressBar({ progress, label, valueLabel, className, indicatorClassName }) {
  // progress should be between 0 and 100
  const normalizedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={cn("w-full", className)}>
      {(label || valueLabel) && (
        <div className="flex justify-between items-end mb-2">
          {label && <span className="text-sm font-semibold text-olive-600">{label}</span>}
          {valueLabel && <span className="text-sm font-bold text-olive-900">{valueLabel}</span>}
        </div>
      )}
      <div className="h-2.5 w-full bg-olive-100/50 rounded-full overflow-hidden shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${normalizedProgress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn("h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 relative", indicatorClassName)}
        >
          {/* Shimmer effect */}
          <div className="absolute top-0 inset-x-0 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </motion.div>
      </div>
    </div>
  );
}
