# LoginAuth — Client

A modern, animated front-end for the LoginAuth API. Built with React 18, a live
WebGL backdrop (three.js / react-three-fiber + postprocessing bloom), and
framer-motion page transitions on a glassmorphism design system.

## Stack

- **React 18** + **react-router-dom 6** (animated routes via `AnimatePresence`)
- **@react-three/fiber** + **@react-three/drei** + **@react-three/postprocessing** — the persistent 3D scene (`src/three/Scene.js`)
- **framer-motion** — page, card, and micro-interaction animations (`src/ui/motion.js`)
- **Tailwind CSS** — design tokens, glass cards, gradients (`tailwind.config.js`, `src/index.css`)
- **formik** + custom validators, **zustand** store, **axios** API helpers, **react-hot-toast**

## Project layout

```
src/
  three/Scene.js        3D backdrop (orb, neon rings, shards, sparkles, bloom)
  ui/                   Design system: AuthShell, Field, GradientButton,
                        AvatarUpload, OtpInput, States, icons, motion
  components/           Pages: Username, Password, Register, Recovery, Reset,
                        Profile, SignupPoliciesPage, PageNotFound
  helper/, hooks/, store/, middleware/   API + auth glue (unchanged contract)
```

## Setup

1. Copy env: `cp .env.example .env` and set `REACT_APP_SERVER_DOMAIN`
   (defaults to the API at `http://localhost:8080`).
2. Install: `npm install`
3. Run: `npm start` → http://localhost:3000

Make sure the API in `../server` is running (`npm run dev`).

## Scripts

| Command         | Description                                            |
| --------------- | ------------------------------------------------------ |
| `npm start`     | Dev server with hot reload at http://localhost:3000    |
| `npm run build` | Optimized production build (source maps off) to `build/` |
| `npm test`      | Test runner in watch mode                              |

## Notes

- The 3D scene is mounted once behind every route and respects
  `prefers-reduced-motion`. Routes are code-split so the first paint is fast.
- Password rules mirror the backend (≥ 8 chars + a special character).
