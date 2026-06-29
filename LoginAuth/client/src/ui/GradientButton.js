import React from 'react';
import { motion } from 'framer-motion';
import { ArrowIcon } from './icons';

/** Primary gradient button with a hover sheen + press spring + optional loading. */
export default function GradientButton({
  children,
  type = 'submit',
  loading = false,
  icon = true,
  onClick,
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={loading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      className="btn-grad group flex items-center justify-center gap-2 disabled:opacity-70"
    >
      {loading ? (
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      ) : (
        <>
          <span>{children}</span>
          {icon && (
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              <ArrowIcon />
            </span>
          )}
        </>
      )}
    </motion.button>
  );
}
