import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'User first name is required'],
        trim: true,
        minLength: 2,
        maxLength: 55,
    },
    lastName: {
        type: String,
        required: [true, 'User last name is required'],
        trim: true,
        minLength: 2,
        maxLength: 55,
    },
    email: {
        type: String,
        required: [true, 'User Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^.+@.+\..+$/, 'Please enter a valid email address.'],
    },
    phoneNumber: {
        type: String,
        required: [true, 'User Phone number is required'],
        trim: true,
        match: [/^(?:0\d{10}|\+234\d{10})$/, 'Please enter a valid phone number. Examples: 09031887232 or +2349031887232'],
        maxLength: 14,
    },
    password: {
        type: String,
        required: [true, 'User Password is required'],
        minLength: 8,
        match: [
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])[^\s]{8,}$/,
            'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
        ],    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    emailVerificationOTP: {
        type: String,
    },
    emailVerificationOTPExpires: {
        type: Date,
    },
    resetPasswordOTP: {
        type: String,
    },
    resetPasswordOTPExpires: {
        type: Date,
    },
    lastVerificationResend: {
        type: Date,
    }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;