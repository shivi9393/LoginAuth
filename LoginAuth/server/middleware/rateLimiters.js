import rateLimit from 'express-rate-limit';

const json = (message) => (req, res) =>
    res.status(429).json({ error: message });

/** Baseline limiter applied to the whole API. */
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    handler: json('Too many requests. Please try again later.'),
});

/** Strict limiter for credential-sensitive endpoints (login, register, auth). */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    handler: json('Too many attempts. Please wait a few minutes and try again.'),
});

/** Very strict limiter for OTP generation / verification and password reset. */
export const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    handler: json('Too many OTP requests. Please wait before trying again.'),
});
