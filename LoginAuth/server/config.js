import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || 'development';
const isProd = NODE_ENV === 'production';

/**
 * Read a required environment variable.
 * In production a missing value is fatal; in development we fall back so the
 * app still boots for local testing.
 */
function required(name, devFallback) {
    const value = process.env[name];
    if (value !== undefined && value !== '') return value;

    if (isProd) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    if (devFallback !== undefined) {
        console.warn(`[config] ${name} not set — using a development fallback. Do NOT use this in production.`);
        return devFallback;
    }
    return undefined;
}

function int(name, fallback) {
    const raw = process.env[name];
    const parsed = parseInt(raw, 10);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function bool(name, fallback) {
    const raw = process.env[name];
    if (raw === undefined) return fallback;
    return raw === 'true' || raw === '1';
}

// A stable random secret is generated for development only. Every restart
// invalidates old dev tokens, which is fine locally and safe by default.
const devJwtSecret = crypto.randomBytes(48).toString('hex');

const ENV = {
    NODE_ENV,
    isProd,
    PORT: int('PORT', 8080),

    // Database — when ATLAS_URI is absent in development we spin up an
    // in-memory MongoDB (see Database/conn.js) so the app runs with zero setup.
    ATLAS_URI: process.env.ATLAS_URI || '',

    // Auth
    JWT_SECRET: required('JWT_SECRET', devJwtSecret),
    JWT_EXPIRY: process.env.JWT_EXPIRY || '1d',
    JWT_ISSUER: process.env.JWT_ISSUER || 'loginauth-api',
    JWT_AUDIENCE: process.env.JWT_AUDIENCE || 'loginauth-client',
    BCRYPT_ROUNDS: int('BCRYPT_ROUNDS', 12),

    // OTP / password recovery
    OTP_TTL_MS: int('OTP_TTL_MINUTES', 10) * 60 * 1000,
    RESET_WINDOW_MS: int('RESET_WINDOW_MINUTES', 10) * 60 * 1000,

    // Password policy
    PASSWORD_MIN_LENGTH: int('PASSWORD_MIN_LENGTH', 8),
    PASSWORD_MAX_LENGTH: int('PASSWORD_MAX_LENGTH', 128),

    // CORS — comma-separated list of allowed origins.
    ALLOWED_ORIGINS: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
        .split(',')
        .map((o) => o.trim())
        .filter(Boolean),

    // Mail (SMTP)
    EMAIL: required('EMAIL', ''),
    PASSWORD: required('PASSWORD', ''),
    EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.ethereal.email',
    EMAIL_PORT: int('EMAIL_PORT', 587),
    EMAIL_SECURE: bool('EMAIL_SECURE', false),
    EMAIL_FROM: process.env.EMAIL_FROM || process.env.EMAIL || 'no-reply@loginauth.local',
};

export default ENV;
