const joi = require("joi");

const createReviewSchema = joi.object({
    requestId: joi.string().required().messages({"any.required": "Request ID is requried"}),
    rating: joi.number().min(1).max(5).required().messages({
        "number.min": "Rating must be at least 1",
        "number.max": "Rating must be at most 5",
        "any.required": "Rating is required"
    }),
    comment: joi.string().min(25).max(500).allow('').messages({
        "string.min": "Comment must be at least 25 characters if provided",
        "string.max": "Comment cannot exceed 500 characters"
    })
});

module.exports = { createReviewSchema };