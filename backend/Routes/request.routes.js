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

router.get("/", verifyToken, getRequests);
router.get("/upcoming", verifyToken, getUpcomingRequests);
router.get("/:id", verifyToken, getRequestById);
router.post("/", verifyToken, uploadRequest.single("heroImage"), createRequest);
router.patch("/:id", verifyToken, updateRequest);

module.exports = router;