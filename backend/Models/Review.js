const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    requestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Request",
        required: true
    },
    reviewerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    revieweeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        minlength: 25,
        maxlength: 500
    }
}, {timestamps: true});

reviewSchema.index({requestId: 1, reviewerId: 1}, {unique: true});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;