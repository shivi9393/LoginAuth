// Shared framer-motion variants so every page feels part of one product.

export const pageVariants = {
  initial: { opacity: 0, y: 24, filter: 'blur(8px)' },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -18,
    filter: 'blur(8px)',
    transition: { duration: 0.35, ease: [0.4, 0, 1, 1] },
  },
};

// Stagger container — children reveal one after another.
export const stagger = {
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
};

export const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export const cardPop = {
  initial: { opacity: 0, scale: 0.96, y: 30 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};
