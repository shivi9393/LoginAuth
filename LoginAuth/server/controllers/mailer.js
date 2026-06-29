import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';

import ENV from '../config.js';
import asyncHandler from '../utils/asyncHandler.js';
import { HttpError, requireEmail, requireString } from '../utils/validate.js';

// SMTP transport. Configure via environment (see .env.example).
// https://ethereal.email/create can generate test credentials.
const transporter = nodemailer.createTransport({
    host: ENV.EMAIL_HOST,
    port: ENV.EMAIL_PORT,
    secure: ENV.EMAIL_SECURE, // true for 465, false for STARTTLS on 587
    auth: ENV.EMAIL
        ? { user: ENV.EMAIL, pass: ENV.PASSWORD }
        : undefined,
});

const MailGenerator = new Mailgen({
    theme: 'default',
    product: {
        name: 'LoginAuth',
        link: 'https://mailgen.js/',
    },
});

/**
 * POST /api/registerMail
 * body: { username, userEmail, text?, subject? }
 */
export const registerMail = asyncHandler(async (req, res) => {
    const username = requireString(req.body.username, 'Username', { min: 1, max: 60 });
    const userEmail = requireEmail(req.body.userEmail);
    // Optional fields — coerce to safe strings, cap length to avoid abuse.
    const text =
        typeof req.body.text === 'string'
            ? req.body.text.slice(0, 1000)
            : "Welcome to Daily Tuition! We're very excited to have you on board.";
    const subject =
        typeof req.body.subject === 'string' && req.body.subject.trim()
            ? req.body.subject.slice(0, 150)
            : 'Signup Successful';

    if (!ENV.EMAIL) {
        throw new HttpError(503, 'Email service is not configured on the server.');
    }

    const emailBody = MailGenerator.generate({
        body: {
            name: username,
            intro: text,
            outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
        },
    });

    await transporter.sendMail({
        from: ENV.EMAIL_FROM,
        to: userEmail,
        subject,
        html: emailBody,
    });

    return res.status(200).send({ msg: 'You should receive an email from us.' });
});
