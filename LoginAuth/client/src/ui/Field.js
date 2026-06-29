import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from './motion';

/**
 * Glassy input with a leading icon and a focus glow.
 * Spread formik's getFieldProps(...) via `field`.
 */
export default function Field({ icon: Icon, field, type = 'text', placeholder, autoComplete, className = '' }) {
  return (
    <motion.label variants={fadeUp} className={`relative block w-full ${className}`}>
      {Icon && (
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300/70">
          <Icon />
        </span>
      )}
      <input
        {...field}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="field"
      />
    </motion.label>
  );
}
