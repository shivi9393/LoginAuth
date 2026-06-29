import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { useAuthStore } from '../store/store';
import { generateOTP, verifyOTP } from '../helper/helper';
import AuthShell from '../ui/AuthShell';
import GradientButton from '../ui/GradientButton';
import OtpInput from '../ui/OtpInput';

export default function Recovery() {
  const navigate = useNavigate();
  const { username } = useAuthStore((state) => state.auth);
  const [OTP, setOTP] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    generateOTP(username).then((code) => {
      if (code) return toast.success('OTP sent to your email!');
      return toast.error('Problem while generating OTP!');
    });
  }, [username]);

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { status } = await verifyOTP({ username, code: OTP });
      if (status === 201) {
        toast.success('Verified successfully!');
        return navigate('/reset');
      }
    } catch (error) {
      toast.error('Wrong OTP! Check your email again.');
    } finally {
      setSubmitting(false);
    }
  }

  function resendOTP() {
    const sentPromise = generateOTP(username);
    toast.promise(sentPromise, {
      loading: 'Sending…',
      success: <b>OTP resent to your email!</b>,
      error: <b>Could not send it.</b>,
    });
  }

  return (
    <AuthShell
      eyebrow="Verification"
      title="Check your inbox"
      subtitle={`We sent a 6-digit verification code${username ? ` for ${username}` : ''}. Enter it below to continue.`}
      footer={
        <>
          Didn&apos;t get a code?{' '}
          <button onClick={resendOTP} className="font-medium text-gradient hover:opacity-80">
            Resend
          </button>
        </>
      }
    >
      <form className="space-y-7" onSubmit={onSubmit}>
        <OtpInput value={OTP} onChange={setOTP} />
        <GradientButton loading={submitting}>Verify &amp; continue</GradientButton>
      </form>
    </AuthShell>
  );
}
