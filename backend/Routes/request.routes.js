const express = require("express");
const router = express.Router();

const verifyToken = require("../Middlewares/auth.middleware");
const uploadRequest = require("../Middlewares/uploadRequest.middleware");
const {
  createRequest,
  getRequests,
  getRequestById,
  getUpcomingRequests,
  updateRequest,
} = require("../Controllers/request.controller");

// GET /requests — public feed (logged-in users)
router.get("/", verifyToken, getRequests);

// GET /requests/upcoming — MUST come before /:id
// If /:id came first, Express would try to find a task with ID "upcoming"
router.get("/upcoming", verifyToken, getUpcomingRequests);

// GET /requests/:id — single request detail
router.get("/:id", verifyToken, getRequestById);

// POST /requests — create a new request (with optional image upload)
router.post("/", verifyToken, uploadRequest.single("heroImage"), createRequest);

// PATCH /requests/:id — edit or cancel a request
router.patch("/:id", verifyToken, updateRequest);

module.exports = router;