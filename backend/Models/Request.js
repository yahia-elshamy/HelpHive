const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    // Who posted this request
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["Gardening", "Tech Support", "Errands", "Repairs", "Pet Care"],
      required: true,
    },
    heroImage: {
      type: String,
      default: null,
    },
    locationName: {
      type: String,
      required: true,
      trim: true,
    },
    scheduledStart: {
      type: Date,
      required: true,
    },
    scheduledEnd: {
      type: Date,
      default: null,
    },
    volunteersNeeded: {
      type: Number,
      default: 1,
      min: 1,
    },
    volunteersFilled: {
      type: Number,
      default: 0,
    },
    honeyReward: {
      type: Number,
      default: 0,
      min: 0,
    },
    isUrgent: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["open", "closed", "cancelled"],
      default: "open",
    },
    flagged: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// This creates a special index that powers the keyword search
requestSchema.index({ title: "text", description: "text" });

const Request = mongoose.model("Request", requestSchema);
module.exports = Request;