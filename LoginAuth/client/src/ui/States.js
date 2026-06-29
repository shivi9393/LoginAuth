import React from 'react';
import { motion } from 'framer-motion';

/** Full-screen centered loader that sits above the 3D scene. */
export function Loader({ label = 'Loading' }) {
  return (
    <main className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-5 px-4">
      <div className="relative h-16 w-16">
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-neon-cyan border-r-neon-violet" />
        <span className="absolute inset-2 animate-spin rounded-full border-2 border-transparent border-b-neon-pink" style={{ animationDirection: 'reverse', animationDuration: '1.4s' }} />
        <span className="absolute inset-0 grid place-items-center font-display text-sm font-bold text-white">L</span>
      </div>
      <motion.p
        initial={{ opacity: 0.3 }}
        animate={{ opacity: 1 }}
        transition={{ repeat: Infinity, repeatType: 'reverse', duration: 0.9 }}
        className="text-sm tracking-wide text-emerald-100/70"
      >
        {label}…
      </motion.p>
    </main>
  );
}

/** Friendly error panel. */
export function ErrorView({ message = 'Something went wrong.' }) {
  return (
    <main className="relative z-10 flex min-h-screen items-center justify-center px-4">
      <div className="glass-card max-w-md px-8 py-10 text-center">
        <h2 className="font-display text-2xl font-semibold text-white">We hit a snag</h2>
        <p className="mt-3 text-sm text-rose-200/80">{message}</p>
      </div>
    </main>
  );
}
