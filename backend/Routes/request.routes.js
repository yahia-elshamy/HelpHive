const express = require("express");
const router = express.Router();

const verifyToken = require("../Middlewares/auth.middleware");
const uploadRequest = require("../Middlewares/uploadRequest.middleware");
const { createRequest, getRequests, getRequestById, updateRequest, deleteRequest } = require("../Controllers/request.controller");

router.get("/", verifyToken, getRequests);
router.get("/:id", verifyToken, getRequestById);
router.post("/", verifyToken, uploadRequest.single("heroImage"), createRequest);
router.patch("/:id", verifyToken, uploadRequest.single("heroImage"), updateRequest);
router.delete("/:id", verifyToken, deleteRequest);

module.exports = router;