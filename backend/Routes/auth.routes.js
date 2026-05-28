const express = require("express");
const router = express.Router();

const upload = require("../Middlewares/upload.middleware");
// use the express-rate-limit to avoid the brute force attacks on my website, to limit the number of the requests coming on the (login, register) routes in common
const {authRateLimiter} = require("../Middlewares/rateLimit.middleware");

const {register, login, logout, refreshAccessToken, forgotPassword, resetPassword} = require("../Controllers/auth.controller");

router.post("/register", authRateLimiter, upload.single("avatar"), register);
router.post("/login", authRateLimiter, login);
router.post("/forgot-password", authRateLimiter, forgotPassword);
router.post("/reset-password/:token", authRateLimiter, resetPassword);
router.get("/refresh", refreshAccessToken);
router.post("/logout", logout);

module.exports = router;