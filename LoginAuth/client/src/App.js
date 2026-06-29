import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

import Scene from './three/Scene';
import { AuthorizeUser, ProtectRoute } from './middleware/auth';

/** Code-split the routes so the 3D scene paints fast. */
const Username = lazy(() => import('./components/Username'));
const Password = lazy(() => import('./components/Password'));
const Profile = lazy(() => import('./components/Profile'));
const Register = lazy(() => import('./components/Register'));
const Recovery = lazy(() => import('./components/Recovery'));
const Reset = lazy(() => import('./components/Reset'));
const PageNotFound = lazy(() => import('./components/PageNotFound'));
const SignupPoliciesPage = lazy(() => import('./components/SignupPoliciesPage'));

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <Suspense fallback={null}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Username />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/password"
            element={
              <ProtectRoute>
                <Password />
              </ProtectRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <AuthorizeUser>
                <Profile />
              </AuthorizeUser>
            }
          />
          <Route path="/recovery" element={<Recovery />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/policy" element={<SignupPoliciesPage />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Persistent 3D backdrop — mounted once, lives behind every route. */}
      <Scene />

      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3500,
          style: {
            background: 'rgba(15, 18, 48, 0.85)',
            color: '#e7e9ff',
            border: '1px solid rgba(255,255,255,0.12)',
            backdropFilter: 'blur(12px)',
            borderRadius: '14px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#34d399', secondary: '#05060f' } },
          error: { iconTheme: { primary: '#f43f5e', secondary: '#05060f' } },
        }}
      />

      <AnimatedRoutes />
    </BrowserRouter>
  );
}
