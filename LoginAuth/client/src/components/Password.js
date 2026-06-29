import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useFormik } from 'formik';

import { passwordValidate } from '../helper/validate';
import useFetch from '../hooks/fetch.hook.js';
import { useAuthStore } from '../store/store';
import { verifyPassword } from '../helper/helper';
import avatar from '../assets/profile.png';
import AuthShell from '../ui/AuthShell';
import Field from '../ui/Field';
import GradientButton from '../ui/GradientButton';
import { Loader, ErrorView } from '../ui/States';
import { LockIcon } from '../ui/icons';

export default function Password() {
  const navigate = useNavigate();
  const { username } = useAuthStore((state) => state.auth);
  const [{ isLoading, apiData, serverError }] = useFetch(`/user/${username}`);

  const formik = useFormik({
    initialValues: { password: '' },
    validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      const loginPromise = verifyPassword({ username, password: values.password });
      toast.promise(loginPromise, {
        loading: 'Verifying…',
        success: <b>Login successful!</b>,
        error: <b>Incorrect password.</b>,
      });
      loginPromise
        .then((res) => {
          const { token } = res.data;
          localStorage.setItem('token', token);
          navigate('/profile');
        })
        .catch(() => {});
    },
  });

  if (isLoading) return <Loader label="Fetching your profile" />;
  if (serverError) return <ErrorView message={serverError.message} />;

  return (
    <AuthShell
      eyebrow="Secure sign-in"
      title={`Hi ${apiData?.firstName || apiData?.username || 'there'}`}
      subtitle="Enter your password to access your dashboard."
      footer={
        <>
          Forgot your password?{' '}
          <Link className="font-medium text-gradient hover:opacity-80" to="/recovery">
            Recover it
          </Link>
        </>
      }
    >
      <div className="mb-6 flex justify-center">
        <div className="relative">
          <span className="absolute -inset-1 rounded-full bg-gradient-to-tr from-neon-violet via-neon-indigo to-neon-cyan opacity-70 blur-md" />
          <img
            src={apiData?.profile || avatar}
            alt="avatar"
            className="relative h-24 w-24 rounded-full border border-white/20 object-cover shadow-card"
          />
        </div>
      </div>

      <form className="space-y-5" onSubmit={formik.handleSubmit}>
        <Field
          icon={LockIcon}
          field={formik.getFieldProps('password')}
          type="password"
          placeholder="Password"
          autoComplete="current-password"
        />
        <GradientButton loading={formik.isSubmitting}>Sign In</GradientButton>
      </form>
    </AuthShell>
  );
}
