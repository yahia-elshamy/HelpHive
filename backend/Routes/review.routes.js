const express = require("express");
const router = express.Router();

const verifyToken = require("../Middlewares/auth.middleware");
const {createReview} = require("../Controllers/review.controller");

router.post("/", verifyToken, createReview);

module.exports = router;