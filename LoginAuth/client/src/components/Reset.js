import React from 'react';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { resetPasswordValidation } from '../helper/validate';
import { resetPassword } from '../helper/helper';
import { useAuthStore } from '../store/store';
import useFetch from '../hooks/fetch.hook';
import AuthShell from '../ui/AuthShell';
import Field from '../ui/Field';
import GradientButton from '../ui/GradientButton';
import { Loader, ErrorView } from '../ui/States';
import { LockIcon, ShieldIcon } from '../ui/icons';
import { fadeUp } from '../ui/motion';

/** 0–4 strength score from length + character variety. */
function scorePassword(pw = '') {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(s, 4);
}

const LABELS = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
const COLORS = ['#f43f5e', '#fb923c', '#facc15', '#34d399', '#22d3ee'];

function StrengthMeter({ value }) {
  const score = scorePassword(value);
  return (
    <motion.div variants={fadeUp} className="space-y-1.5">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-1.5 flex-1 rounded-full transition-colors duration-300"
            style={{ background: i < score ? COLORS[score] : 'rgba(255,255,255,0.1)' }}
          />
        ))}
      </div>
      {value && (
        <p className="text-right text-xs" style={{ color: COLORS[score] }}>
          {LABELS[score]}
        </p>
      )}
    </motion.div>
  );
}

export default function Reset() {
  const { username } = useAuthStore((state) => state.auth);
  const navigate = useNavigate();
  const [{ isLoading, status, serverError }] = useFetch('createResetSession');

  const formik = useFormik({
    initialValues: { password: '', confirm_pwd: '' },
    validate: resetPasswordValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      const resetPromise = resetPassword({ username, password: values.password });
      toast.promise(resetPromise, {
        loading: 'Updating…',
        success: <b>Password reset successfully!</b>,
        error: <b>Could not reset.</b>,
      });
      resetPromise.then(() => navigate('/password')).catch(() => {});
    },
  });

  if (isLoading) return <Loader label="Preparing secure session" />;
  if (serverError) return <ErrorView message={serverError.message} />;
  if (status && status !== 201) return <Navigate to="/password" replace />;

  return (
    <AuthShell
      eyebrow="Almost done"
      title="Set a new password"
      subtitle="Choose a strong password you haven't used before — at least 8 characters with a special symbol."
    >
      <form className="space-y-5" onSubmit={formik.handleSubmit}>
        <Field
          icon={LockIcon}
          field={formik.getFieldProps('password')}
          type="password"
          placeholder="New password"
          autoComplete="new-password"
        />
        <StrengthMeter value={formik.values.password} />
        <Field
          icon={ShieldIcon}
          field={formik.getFieldProps('confirm_pwd')}
          type="password"
          placeholder="Confirm password"
          autoComplete="new-password"
        />
        <GradientButton loading={formik.isSubmitting}>Reset password</GradientButton>
      </form>
    </AuthShell>
  );
}
