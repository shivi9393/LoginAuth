import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp } from './motion';

/** Glowing circular avatar that doubles as a file picker. */
export default function AvatarUpload({ src, fallback, onUpload, id = 'profile' }) {
  return (
    <motion.div variants={fadeUp} className="flex justify-center">
      <label htmlFor={id} className="group relative cursor-pointer">
        <span className="absolute -inset-1 rounded-full bg-gradient-to-tr from-neon-violet via-neon-indigo to-neon-cyan opacity-70 blur-md transition group-hover:opacity-100" />
        <img
          src={src || fallback}
          alt="avatar"
          className="relative h-28 w-28 rounded-full border border-white/20 object-cover shadow-card"
        />
        <span className="absolute inset-0 grid place-items-center rounded-full bg-black/45 text-[11px] font-medium uppercase tracking-wide text-white opacity-0 transition group-hover:opacity-100">
          Change
        </span>
        <input id={id} name={id} type="file" accept="image/*" onChange={onUpload} />
      </label>
    </motion.div>
  );
}
