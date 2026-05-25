const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true
    },
    passwordHash: {
        type: String,
        required: true,
        minlength: 8
    },
    avatar: {
        type: String
    },
    role: {
        type: String,
        enum: ["requester", "volunteer", "admin"],
        default: "requester"
    },
    honeyCollected: {
        type: Number,
        default: 0
    },
    taskCompleted: {
        type: Number,
        default: 0
    },
    hiveRating: {
        type: Number,
        default: 0
    },
    trustScore: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }

}, {timestamps: true});

const User = mongoose.model("User", userSchema);
module.exports = User;