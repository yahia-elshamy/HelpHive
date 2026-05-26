const rateLimit = require("express-rate-limit");

const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    ipv6Subnet: 56
});

module.exports = {authRateLimiter};