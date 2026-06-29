import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';

import { usernameValidate } from '../helper/validate';
import { useAuthStore } from '../store/store.js';
import AuthShell from '../ui/AuthShell';
import Field from '../ui/Field';
import GradientButton from '../ui/GradientButton';
import { UserIcon } from '../ui/icons';

export default function Username() {
  const navigate = useNavigate();
  const setUsername = useAuthStore((state) => state.setUsername);

  const formik = useFormik({
    initialValues: { username: '' },
    validate: usernameValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      setUsername(values.username);
      navigate('/password');
    },
  });

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Hello Again"
      subtitle="Sign in to your LoginAuth account and pick up right where you left off."
      footer={
        <>
          Not a member?{' '}
          <Link className="font-medium text-gradient hover:opacity-80" to="/register">
            Create an account
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={formik.handleSubmit}>
        <Field
          icon={UserIcon}
          field={formik.getFieldProps('username')}
          placeholder="Username"
          autoComplete="username"
        />
        <GradientButton loading={formik.isSubmitting}>Continue</GradientButton>
      </form>
    </AuthShell>
  );
}
