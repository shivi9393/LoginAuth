import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import AuthShell from '../ui/AuthShell';
import { fadeUp } from '../ui/motion';
import { ShieldIcon, LockIcon, KeyIcon } from '../ui/icons';

const POLICIES = [
  {
    icon: ShieldIcon,
    title: 'Your data, protected',
    body: 'Passwords are hashed with bcrypt and never stored in plain text. We only keep what is needed to run your account.',
  },
  {
    icon: LockIcon,
    title: 'Secure by default',
    body: 'Every request is rate-limited, sanitized against injection, and served over hardened HTTP security headers.',
  },
  {
    icon: KeyIcon,
    title: 'You stay in control',
    body: 'Reset your password any time with a one-time code sent to your email. Sessions are short-lived and revocable.',
  },
];

export default function SignupPoliciesPage() {
  return (
    <AuthShell
      eyebrow="Privacy policy"
      title="How we keep you safe"
      subtitle="A quick summary of how LoginAuth handles your account and your data."
      size="md"
      footer={
        <Link className="font-medium text-gradient hover:opacity-80" to="/register">
          ← Back to registration
        </Link>
      }
    >
      <div className="space-y-4">
        {POLICIES.map(({ icon: Icon, title, body }) => (
          <motion.div
            key={title}
            variants={fadeUp}
            className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
          >
            <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-tr from-neon-violet/30 to-neon-cyan/30 text-emerald-200">
              <Icon width={20} height={20} />
            </span>
            <div>
              <h3 className="font-display text-base font-semibold text-white">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-emerald-100/60">{body}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </AuthShell>
  );
}
