const express = require("express");
const router = express.Router();

const verifyToken = require("../Middlewares/auth.middleware");
const { applyForTask, acceptApplication, getApplicantsByRequest, startTask, completeTask } = require("../Controllers/application.controller");

router.post("/", verifyToken, applyForTask);
router.get("/request/:id", verifyToken, getApplicantsByRequest);
router.patch("/:id/accept", verifyToken, acceptApplication);
router.patch("/:id/start", verifyToken, startTask);
router.patch("/:id/complete", verifyToken, completeTask);

module.exports = router;