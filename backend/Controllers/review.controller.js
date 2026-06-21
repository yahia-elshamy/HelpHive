const Review = require("../Models/Review");
const Request = require("../Models/Request");
const User = require("../Models/User");
const Application = require("../Models/Application");
const {createReviewSchema} = require("../Validations/review.validation");

const createReview = async (req, res, next) => {
    try {
        const { error, value } = createReviewSchema.validate(req.body, { abortEarly: false, stripUnknown: true });

        if (error) return res.status(400).json({
            message: "Validation error",
            errors: error.details.map((e) => e.message)
        });

        const { requestId, rating, comment } = value;
        const reviewerId = req.user.id;

        const request = await Request.findById(requestId);
        if (!request || request.status !== "closed") {
            return res.status(400).json({ message: "You can only review completed and closed tasks" });
        }

        let revieweeId;
        if (reviewerId === request.requesterId.toString()) {
            const application = await Application.findOne({ requestId, status: "accepted" });
            if (!application) return res.status(404).json({ message: "No accepted volunteer for this task" });
            revieweeId = application.volunteerId;
        } else {
            revieweeId = request.requesterId;
        }

        const existingReview = await Review.findOne({ requestId, reviewerId });
        if (existingReview) return res.status(400).json({ message: "You have already reviewed this task" });

        const newReview = await Review.create({
            requestId,
            reviewerId,
            revieweeId,
            rating,
            comment
        });

        const allReviews = await Review.find({ revieweeId });
        const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
        const newAvgRating = totalRating / allReviews.length;

        await User.findByIdAndUpdate(revieweeId, {
            hiveRating: newAvgRating.toFixed(1),
            $inc: { trustScore: rating >= 4 ? 5 : -2 }
        });

        return res.status(201).json({
            success: true,
            message: "Review submitted successfully! Thank you for your feedback",
            data: newReview
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {createReview};