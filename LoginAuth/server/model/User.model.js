import mongoose from 'mongoose';
import validator from 'validator';

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Please provide a unique username'],
            unique: true,
            trim: true,
            minlength: [3, 'Username must be at least 3 characters'],
            maxlength: [30, 'Username must be at most 30 characters'],
            match: [/^[a-zA-Z0-9._-]+$/, 'Username may only contain letters, numbers and . _ -'],
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            // Never return the hash by default — must be explicitly selected.
            select: false,
        },
        email: {
            type: String,
            required: [true, 'Please provide a unique email'],
            unique: true,
            trim: true,
            lowercase: true,
            validate: {
                validator: (v) => validator.isEmail(v),
                message: 'Please provide a valid email address',
            },
        },
        firstName: { type: String, trim: true, maxlength: 60 },
        lastName: { type: String, trim: true, maxlength: 60 },
        // String, not Number — phone numbers can have leading zeros / + prefixes.
        mobile: { type: String, trim: true, maxlength: 20 },
        address: { type: String, trim: true, maxlength: 200 },
        profile: { type: String, trim: true, default: '' },

        // --- Password recovery (per-user, time-limited) ---
        // Stored hashed; never returned to clients.
        resetOTPHash: { type: String, select: false },
        resetOTPExpires: { type: Date, select: false },
        // Set true only after a correct OTP is verified; gates resetPassword.
        resetVerified: { type: Boolean, default: false, select: false },
        resetVerifiedExpires: { type: Date, select: false },
    },
    { timestamps: true }
);

/** Strip sensitive fields from any JSON serialization as a safety net. */
UserSchema.set('toJSON', {
    transform(_doc, ret) {
        delete ret.password;
        delete ret.resetOTPHash;
        delete ret.resetOTPExpires;
        delete ret.resetVerified;
        delete ret.resetVerifiedExpires;
        delete ret.__v;
        return ret;
    },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
