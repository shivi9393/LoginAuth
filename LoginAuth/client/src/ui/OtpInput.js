import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from './motion';

/**
 * Segmented 6-digit OTP input. Calls onChange(joinedString) on every change.
 * Supports paste, auto-advance, and backspace navigation.
 */
export default function OtpInput({ length = 6, value = '', onChange }) {
  const refs = useRef([]);
  const digits = Array.from({ length }, (_, i) => value[i] || '');

  const set = (i, char) => {
    const next = digits.slice();
    next[i] = char;
    onChange(next.join(''));
  };

  const handleChange = (i, e) => {
    const char = e.target.value.replace(/\D/g, '').slice(-1);
    set(i, char);
    if (char && i < length - 1) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (pasted) {
      onChange(pasted);
      refs.current[Math.min(pasted.length, length - 1)]?.focus();
    }
  };

  return (
    <motion.div variants={fadeUp} className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          value={d}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          inputMode="numeric"
          maxLength={1}
          aria-label={`Digit ${i + 1}`}
          className="h-14 w-11 rounded-xl border border-white/12 bg-white/[0.04] text-center font-display text-2xl font-semibold text-white outline-none transition focus:border-neon-violet/80 focus:bg-neon-violet/10 focus:shadow-[0_0_0_4px_rgba(45,212,191,0.16)] sm:w-12"
        />
      ))}
    </motion.div>
  );
}
