const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        enum: ["new_message", "badge_unlocked", "task_accepted", "task_completed", "new_applicant"]
    },
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 30,
        trim: true
    },
    body: {
        type: String,
        minlength: 5,
        maxlength: 500,
        required: true
    },
    relatedId: {
        type: mongoose.Schema.Types.ObjectId
    },
    isRead: {
        type: Boolean,
        default: false
    },

}, {timestamps: true});

notificationSchema.index({userId: 1, isRead: 1});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;