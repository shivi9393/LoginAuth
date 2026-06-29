import React from 'react';
import { motion } from 'framer-motion';
import { pageVariants, cardPop, stagger, fadeUp } from './motion';

/** Animated brand lockup shown above every card. */
export function Brand() {
  return (
    <motion.div variants={fadeUp} className="mb-6 flex items-center justify-center gap-3">
      <div className="relative h-9 w-9">
        <span className="absolute inset-0 animate-spin-slow rounded-xl bg-gradient-to-tr from-neon-violet via-neon-indigo to-neon-cyan blur-[2px]" />
        <span className="absolute inset-[3px] rounded-lg bg-ink-900/90 backdrop-blur" />
        <span className="absolute inset-0 grid place-items-center font-display text-sm font-bold text-white">L</span>
      </div>
      <span className="font-display text-lg font-semibold tracking-tight text-white">
        Login<span className="text-gradient">Auth</span>
      </span>
    </motion.div>
  );
}

/**
 * Page wrapper: handles the enter/exit transition and renders the glass card.
 * Props: eyebrow, title, subtitle, children, footer, size ('sm' | 'md' | 'lg').
 */
export default function AuthShell({ eyebrow, title, subtitle, children, footer, size = 'sm' }) {
  const width =
    size === 'lg' ? 'max-w-3xl' : size === 'md' ? 'max-w-xl' : 'max-w-md';

  return (
    <motion.main
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10"
    >
      <motion.div
        variants={cardPop}
        initial="initial"
        animate="animate"
        className={`glass-card w-full ${width} animate-floaty px-7 py-9 sm:px-10 sm:py-11`}
        style={{ animationDuration: '9s' }}
      >
        <motion.div variants={stagger} initial="initial" animate="animate">
          <Brand />

          <motion.div variants={fadeUp} className="mb-7 text-center">
            {eyebrow && (
              <span className="chip mb-4">
                {eyebrow}
              </span>
            )}
            <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-indigo-100/60">
                {subtitle}
              </p>
            )}
          </motion.div>

          {children}

          {footer && (
            <motion.div variants={fadeUp} className="mt-7 text-center text-sm text-indigo-100/60">
              {footer}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </motion.main>
  );
}
