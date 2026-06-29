import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useFormik } from 'formik';
import { motion } from 'framer-motion';

import { profileValidation } from '../helper/validate';
import convertToBase64 from '../helper/convert';
import useFetch from '../hooks/fetch.hook';
import { updateUser } from '../helper/helper';
import { useAuthStore } from '../store/store';
import avatar from '../assets/profile.png';
import AuthShell from '../ui/AuthShell';
import Field from '../ui/Field';
import GradientButton from '../ui/GradientButton';
import AvatarUpload from '../ui/AvatarUpload';
import { Loader, ErrorView } from '../ui/States';
import { fadeUp } from '../ui/motion';
import { UserIcon, MailIcon, PhoneIcon, PinIcon } from '../ui/icons';

export default function Profile() {
  const [file, setFile] = useState();
  const { username } = useAuthStore((state) => state.auth);
  const [{ isLoading, apiData, serverError }] = useFetch(`/user/${username}`);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      firstName: apiData?.firstName || '',
      lastName: apiData?.lastName || '',
      email: apiData?.email || '',
      mobile: apiData?.mobile || '',
      address: apiData?.address || '',
    },
    enableReinitialize: true,
    validate: profileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = await Object.assign(values, { profile: file || apiData?.profile || '' });
      const updatePromise = updateUser(values);
      toast.promise(updatePromise, {
        loading: 'Updating…',
        success: <b>Profile updated!</b>,
        error: <b>Could not update.</b>,
      });
    },
  });

  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };

  function userLogout() {
    localStorage.removeItem('token');
    navigate('/');
  }

  if (isLoading) return <Loader label="Loading your profile" />;
  if (serverError) return <ErrorView message={serverError.message} />;

  return (
    <AuthShell
      eyebrow={`@${apiData?.username || username || 'you'}`}
      title="Your Profile"
      subtitle="Keep your details up to date. Changes are saved securely to your account."
      size="md"
      footer={
        <>
          Done for now?{' '}
          <button onClick={userLogout} className="font-medium text-gradient hover:opacity-80">
            Log out
          </button>
        </>
      }
    >
      <form className="space-y-5" onSubmit={formik.handleSubmit}>
        <AvatarUpload src={file || apiData?.profile} fallback={avatar} onUpload={onUpload} />

        <motion.div variants={fadeUp} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field icon={UserIcon} field={formik.getFieldProps('firstName')} placeholder="First name" autoComplete="given-name" />
          <Field icon={UserIcon} field={formik.getFieldProps('lastName')} placeholder="Last name" autoComplete="family-name" />
        </motion.div>

        <motion.div variants={fadeUp} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field icon={PhoneIcon} field={formik.getFieldProps('mobile')} placeholder="Mobile number" autoComplete="tel" />
          <Field icon={MailIcon} field={formik.getFieldProps('email')} placeholder="Email address" autoComplete="email" />
        </motion.div>

        <Field icon={PinIcon} field={formik.getFieldProps('address')} placeholder="Address" autoComplete="street-address" />

        <GradientButton loading={formik.isSubmitting} icon={false}>
          Save changes
        </GradientButton>
      </form>
    </AuthShell>
  );
}
