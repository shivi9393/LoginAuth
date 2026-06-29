import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowIcon } from '../ui/icons';

export default function PageNotFound() {
  return (
    <main className="relative z-10 flex min-h-screen items-center justify-center px-4 text-center">
      <div>
        <motion.h1
          initial={{ opacity: 0, scale: 0.8, filter: 'blur(12px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-[28vw] font-bold leading-none text-gradient sm:text-[180px]"
        >
          404
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="mx-auto -mt-2 max-w-sm text-sm text-emerald-100/70"
        >
          This trail vanished into the deep jungle. Let&apos;s get you back to the clearing.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8"
        >
          <Link
            to="/"
            className="btn-grad group inline-flex w-auto items-center gap-2 px-7"
            style={{ width: 'auto' }}
          >
            Back to sign in
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              <ArrowIcon />
            </span>
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
