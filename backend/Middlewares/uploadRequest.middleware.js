const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// diskStorage tells Multer WHERE to save the file and WHAT to name it
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save hero images in a separate folder from avatars
    cb(null, "uploads/requests");
  },
  filename: (req, file, cb) => {
    // Generate a unique name so files never overwrite each other
    // Example: request-f47ac10b-58cc-4372-a567-0e02b2c3d479.jpg
    const ext = path.extname(file.originalname); // gets ".jpg" or ".png"
    cb(null, `request-${uuidv4()}${ext}`);
  },
});

// fileFilter runs before saving — it checks if the file type is allowed
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // accept the file
  } else {
    cb(new Error("Only JPEG, PNG, and WEBP images are allowed"), false);
  }
};

const uploadRequest = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max for hero images
});

module.exports = uploadRequest;