import validator from 'validator';
import ENV from '../config.js';

/**
 * A 400-level error carrying a client-safe message. Thrown by validators and
 * controllers; translated to a JSON response by the global error handler.
 */
export class HttpError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        this.expose = true; // safe to show this message to the client
    }
}

/**
 * Ensure a value is a non-empty string. This is the primary defense against
 * NoSQL operator injection — e.g. a body of { username: { $ne: null } } is
 * rejected here before it can reach a Mongo query.
 */
export function requireString(value, field, { min = 1, max = 1024 } = {}) {
    if (typeof value !== 'string') {
        throw new HttpError(400, `${field} is required and must be text.`);
    }
    const trimmed = value.trim();
    if (trimmed.length < min) {
        throw new HttpError(400, `${field} must be at least ${min} characters.`);
    }
    if (trimmed.length > max) {
        throw new HttpError(400, `${field} must be at most ${max} characters.`);
    }
    return trimmed;
}

export function requireUsername(value) {
    const username = requireString(value, 'Username', { min: 3, max: 30 });
    if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
        throw new HttpError(400, 'Username may only contain letters, numbers and . _ -');
    }
    return username;
}

export function requireEmail(value) {
    const email = requireString(value, 'Email', { min: 3, max: 254 });
    if (!validator.isEmail(email)) {
        throw new HttpError(400, 'Please provide a valid email address.');
    }
    return validator.normalizeEmail(email, { gmail_remove_dots: false }) || email.toLowerCase();
}

export function requirePassword(value) {
    if (typeof value !== 'string') {
        throw new HttpError(400, 'Password is required and must be text.');
    }
    if (value.length < ENV.PASSWORD_MIN_LENGTH) {
        throw new HttpError(400, `Password must be at least ${ENV.PASSWORD_MIN_LENGTH} characters.`);
    }
    if (value.length > ENV.PASSWORD_MAX_LENGTH) {
        throw new HttpError(400, `Password must be at most ${ENV.PASSWORD_MAX_LENGTH} characters.`);
    }
    return value;
}
