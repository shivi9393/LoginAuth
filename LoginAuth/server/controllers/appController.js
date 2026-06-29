import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import otpGenerator from 'otp-generator';

import UserModel from '../model/User.model.js';
import ENV from '../config.js';
import asyncHandler from '../utils/asyncHandler.js';
import {
    HttpError,
    requireUsername,
    requireEmail,
    requirePassword,
} from '../utils/validate.js';

/**
 * Middleware: confirm the user identified by `username` exists.
 * Validates the username is a real string first (blocks NoSQL injection).
 */
export const verifyUser = asyncHandler(async (req, res, next) => {
    const raw = req.method === 'GET' ? req.query.username : req.body.username;
    const username = requireUsername(raw);

    const exists = await UserModel.exists({ username });
    if (!exists) throw new HttpError(404, "Can't find user!");

    req.username = username;
    next();
});

/**
 * POST /api/register
 * body: { username, password, email, profile?, firstName?, lastName?, mobile?, address? }
 */
export const register = asyncHandler(async (req, res) => {
    const username = requireUsername(req.body.username);
    const email = requireEmail(req.body.email);
    const password = requirePassword(req.body.password);
    const profile = typeof req.body.profile === 'string' ? req.body.profile.trim() : '';

    // Friendly pre-check; the unique index is the real guarantee against races.
    const clash = await UserModel.findOne({ $or: [{ username }, { email }] })
        .select('username email')
        .lean();
    if (clash) {
        const field = clash.username === username ? 'username' : 'email';
        throw new HttpError(409, `Please use a unique ${field}.`);
    }

    const hashedPassword = await bcrypt.hash(password, ENV.BCRYPT_ROUNDS);

    try {
        await UserModel.create({ username, email, password: hashedPassword, profile });
    } catch (err) {
        // Duplicate key from a concurrent insert slipping past the pre-check.
        if (err && err.code === 11000) {
            throw new HttpError(409, 'Please use a unique username and email.');
        }
        throw err;
    }

    return res.status(201).send({ msg: 'User registered successfully' });
});

/**
 * POST /api/login
 * body: { username, password }
 */
export const login = asyncHandler(async (req, res) => {
    const username = requireUsername(req.body.username);
    const password = requirePassword(req.body.password);

    const user = await UserModel.findOne({ username }).select('+password');
    // Generic message regardless of which half failed (no enumeration here).
    const ok = user && (await bcrypt.compare(password, user.password));
    if (!ok) throw new HttpError(401, 'Incorrect username or password.');

    const token = jwt.sign(
        { userId: user._id, username: user.username },
        ENV.JWT_SECRET,
        {
            algorithm: 'HS256',
            expiresIn: ENV.JWT_EXPIRY,
            issuer: ENV.JWT_ISSUER,
            audience: ENV.JWT_AUDIENCE,
        }
    );

    return res.status(200).send({
        msg: 'Login successful...!',
        username: user.username,
        token,
    });
});

/**
 * GET /api/user/:username
 */
export const getUser = asyncHandler(async (req, res) => {
    const username = requireUsername(req.params.username);

    const user = await UserModel.findOne({ username });
    if (!user) throw new HttpError(404, "Couldn't find the user");

    // toJSON transform strips password and all reset/internal fields.
    return res.status(200).send(user.toJSON());
});

/**
 * PUT /api/updateuser   (requires Auth)
 * Updates only an allow-listed set of profile fields for the *token's* user.
 */
export const updateUser = asyncHandler(async (req, res) => {
    const { userId } = req.user || {};
    if (!userId) throw new HttpError(401, 'User not found...!');

    const allowed = ['firstName', 'lastName', 'mobile', 'address', 'profile', 'email'];
    const update = {};
    for (const key of allowed) {
        if (req.body[key] !== undefined) update[key] = req.body[key];
    }
    if (update.email !== undefined) update.email = requireEmail(update.email);

    await UserModel.updateOne({ _id: userId }, { $set: update }, { runValidators: true });
    return res.status(200).send({ msg: 'Record updated...!' });
});

/**
 * GET /api/generateOTP?username=...
 * Generates a 6-digit OTP, stores it hashed with an expiry on the user, and
 * returns the code so the existing client can email it.
 *
 * NOTE: returning the code in the response preserves the current client flow.
 * The stronger design is to email it server-side and never return it — planned
 * for the client pass.
 */
export const generateOTP = asyncHandler(async (req, res) => {
    const username = req.username; // set by verifyUser

    const code = otpGenerator.generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
    });

    const resetOTPHash = await bcrypt.hash(code, ENV.BCRYPT_ROUNDS);
    await UserModel.updateOne(
        { username },
        {
            $set: {
                resetOTPHash,
                resetOTPExpires: new Date(Date.now() + ENV.OTP_TTL_MS),
                resetVerified: false,
                resetVerifiedExpires: null,
            },
        }
    );

    return res.status(201).send({ code });
});

/**
 * GET /api/verifyOTP?username=...&code=...
 * Verifies the OTP against the per-user hash + expiry, then opens a short
 * password-reset window for that user only.
 */
export const verifyOTP = asyncHandler(async (req, res) => {
    const username = req.username; // set by verifyUser
    const code = typeof req.query.code === 'string' ? req.query.code.trim() : '';
    if (!code) throw new HttpError(400, 'OTP code is required.');

    const user = await UserModel.findOne({ username }).select(
        '+resetOTPHash +resetOTPExpires'
    );

    const valid =
        user &&
        user.resetOTPHash &&
        user.resetOTPExpires &&
        user.resetOTPExpires.getTime() > Date.now() &&
        (await bcrypt.compare(code, user.resetOTPHash));

    if (!valid) throw new HttpError(400, 'Invalid or expired OTP');

    // Consume the OTP and open the reset window for this user.
    await UserModel.updateOne(
        { username },
        {
            $set: {
                resetVerified: true,
                resetVerifiedExpires: new Date(Date.now() + ENV.RESET_WINDOW_MS),
            },
            $unset: { resetOTPHash: '', resetOTPExpires: '' },
        }
    );

    return res.status(201).send({ msg: 'Verified successfully!' });
});

/**
 * GET /api/createResetSession
 * UI gate only. The real authorization happens per-user in resetPassword,
 * which independently verifies the reset window, so this stays permissive.
 */
export const createResetSession = asyncHandler(async (_req, res) => {
    return res.status(201).send({ flag: true });
});

/**
 * PUT /api/resetPassword
 * body: { username, password }
 * Only succeeds inside a valid, unexpired reset window opened by verifyOTP for
 * that specific user.
 */
export const resetPassword = asyncHandler(async (req, res) => {
    const username = requireUsername(req.body.username);
    const password = requirePassword(req.body.password);

    const user = await UserModel.findOne({ username }).select(
        '+resetVerified +resetVerifiedExpires'
    );
    if (!user) throw new HttpError(404, 'Username not found');

    const windowOpen =
        user.resetVerified &&
        user.resetVerifiedExpires &&
        user.resetVerifiedExpires.getTime() > Date.now();
    if (!windowOpen) {
        throw new HttpError(440, 'Reset session expired! Please verify your OTP again.');
    }

    const hashedPassword = await bcrypt.hash(password, ENV.BCRYPT_ROUNDS);
    await UserModel.updateOne(
        { username },
        {
            $set: { password: hashedPassword },
            // Close the reset window so the OTP/session can't be reused.
            $unset: {
                resetVerified: '',
                resetVerifiedExpires: '',
                resetOTPHash: '',
                resetOTPExpires: '',
            },
        }
    );

    return res.status(201).send({ msg: 'Record updated...!' });
});
