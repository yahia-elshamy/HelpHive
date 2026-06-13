const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
    requestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Request",
        required: true
    },
    volunteerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
    },
    missionStatus: {
        type: String,
        enum: ["pending", "in_progress", "completed"],
        default: "pending"
    },
    honeyAwarded: {
        type: Boolean,
        default: false
    },
    startedAt: Date,
    completedAt: Date
}, {timestamps: true});

applicationSchema.index({requestId: 1, volunteerId: 1}, {unique: true});

const Application = mongoose.model("Application", applicationSchema);
module.exports = Application;