import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useFormik } from 'formik';
import { motion } from 'framer-motion';

import { registerValidation } from '../helper/validate';
import convertToBase64 from '../helper/convert';
import { registerUser } from '../helper/helper';
import avatar from '../assets/profile.png';
import AuthShell from '../ui/AuthShell';
import Field from '../ui/Field';
import GradientButton from '../ui/GradientButton';
import AvatarUpload from '../ui/AvatarUpload';
import { fadeUp } from '../ui/motion';
import { UserIcon, MailIcon, LockIcon } from '../ui/icons';

export default function Register() {
  const navigate = useNavigate();
  const [file, setFile] = useState();
  const [accepted, setAccepted] = useState(false);

  const formik = useFormik({
    initialValues: { email: '', username: '', password: '' },
    validate: registerValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      if (!accepted) {
        toast.error('Please accept the privacy policy.');
        return;
      }
      values = await Object.assign(values, { profile: file });
      const registerPromise = registerUser(values);
      toast.promise(registerPromise, {
        loading: 'Creating your account…',
        success: <b>Registered successfully!</b>,
        error: <b>Could not register.</b>,
      });
      registerPromise.then(() => navigate('/')).catch(() => {});
    },
  });

  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };

  return (
    <AuthShell
      eyebrow="Join us"
      title="Create your account"
      subtitle="A premium, secure home for your identity. It only takes a minute."
      footer={
        <>
          Already have an account?{' '}
          <Link className="font-medium text-gradient hover:opacity-80" to="/">
            Sign in
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={formik.handleSubmit}>
        <AvatarUpload src={file} fallback={avatar} onUpload={onUpload} />

        <Field icon={MailIcon} field={formik.getFieldProps('email')} placeholder="Email address" autoComplete="email" />
        <Field icon={UserIcon} field={formik.getFieldProps('username')} placeholder="Username" autoComplete="username" />
        <Field
          icon={LockIcon}
          field={formik.getFieldProps('password')}
          type="password"
          placeholder="Password"
          autoComplete="new-password"
        />

        <motion.label variants={fadeUp} className="flex cursor-pointer items-start gap-3 text-sm text-emerald-100/70">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-neon-violet"
            style={{ display: 'inline-block' }}
          />
          <span>
            I agree to the{' '}
            <Link className="text-gradient hover:opacity-80" to="/policy">
              privacy policy
            </Link>{' '}
            and terms of service.
          </span>
        </motion.label>

        <GradientButton loading={formik.isSubmitting}>Create account</GradientButton>
      </form>
    </AuthShell>
  );
}
