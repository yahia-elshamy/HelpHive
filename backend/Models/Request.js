const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
    requesterId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        reuired: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        enum: ["Gardening", "Tech Support", "Errands", "Repairs", "Pet Care"],
        required: true
    },
    heroImg: { 
        type: String,
        default: null
    },
    locationName: {
        type: String,
        required: true,
        trim: true
    },
    scheduledStart: {
        type: Date,
        required: true
    },
    scheduledEnd: {
        type: Date,
        default: null
    },
    volunteersNeeded: {
        type: Number,
        default: 1,
        min: 1
    },
    volunteerFilled: {
        type: Number,
        default: 0
    },
    honeyReward: {
        type: Number,
        default: 0,
        min: 0
    },
    isUrgent: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["open", "closed", "cancelled"],
        default: "open"
    },
    flagged: {
        type: String,
        default: false
    }
}, {timestamps: true});

requestSchema.index({title: "text", description: "text"});

const Request = mongoose.model("Request", requestSchema);
module.exports = Request;