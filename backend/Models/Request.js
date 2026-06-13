const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    // Who posted this request
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // links to the User collection
      required: true,
    },

    // The main title shown on the card
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // The full description shown on the detail page
    description: {
      type: String,
      required: true,
      trim: true,
    },

    // One of the 5 fixed categories shown as filter pills
    category: {
      type: String,
      enum: ["Gardening", "Tech Support", "Errands", "Repairs", "Pet Care"],
      required: true,
    },

    // The uploaded task photo — stored as a file path like "/uploads/requests/xyz.jpg"
    heroImage: {
      type: String,
      default: null,
    },

    // Plain text address — no map, no GPS, just a string
    locationName: {
      type: String,
      required: true,
      trim: true,
    },

    // When the task is scheduled
    scheduledStart: {
      type: Date,
      required: true,
    },

    scheduledEnd: {
      type: Date,
      default: null,
    },

    // How many volunteers are needed
    volunteersNeeded: {
      type: Number,
      default: 1,
      min: 1,
    },

    // How many have already been accepted (increments on acceptance)
    volunteersFilled: {
      type: Number,
      default: 0,
    },

    // Gamification reward shown on the card
    honeyReward: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Shows the red "Urgent" badge on the card
    isUrgent: {
      type: Boolean,
      default: false,
    },

    // open = visible on feed, closed = full, cancelled = soft deleted
    status: {
      type: String,
      enum: ["open", "closed", "cancelled"],
      default: "open",
    },

    // Admin can flag a post — flagged posts disappear from the public feed
    flagged: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

// This creates a special index that powers the keyword search
// Without this index, $text search will not work
requestSchema.index({ title: "text", description: "text" });

const Request = mongoose.model("Request", requestSchema);
module.exports = Request;