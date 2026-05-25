const express = require("express");
const router = express.Router();
const upload = require("../Middlewares/upload.middleware");
const {register} = require("../Controllers/auth.controller");

router.post("/register", upload.single("avatar"), register);

module.exports = router;