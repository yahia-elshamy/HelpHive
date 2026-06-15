const mongoose = require("mongoose");

const badgeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    badgeKey: {
        type: String,
        enum: ["early_bird", "seed_planter", "top_helper", "gold_tier"]
    },
    awardedAt: Date    
}, {timestamps: true});

badgeSchema.index({userId: 1, badgeKey: 1}, {unique: true});

const Badge = mongoose.model("Badge", badgeSchema);

module.exports = Badge;