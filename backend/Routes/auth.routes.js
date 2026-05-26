const express = require("express");
const router = express.Router();
const upload = require("../Middlewares/upload.middleware");
const {register} = require("../Controllers/auth.controller");
// use the express-rate-limit to avoid the brute force attacks on my website, to limit the number of the requests coming on the (login, register) routes in common
const {authRateLimiter} = require("../Middlewares/rateLimit.middleware");


router.post("/register", authRateLimiter, upload.single("avatar"), register);

module.exports = router;