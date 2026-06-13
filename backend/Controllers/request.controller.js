const Request = require("../Models/Request");
const { createRequestSchema, updateRequestSchema } = require("../Validations/request.validation");

// ─────────────────────────────────────────────────────────────────
// POST /requests
// Creates a new help request
// ─────────────────────────────────────────────────────────────────
const createRequest = async (req, res, next) => {
  try {
    // IMPORTANT: FormData sends everything as strings
    // So "true" (string) needs to be converted to true (boolean)
    // and "3" (string) needs to become 3 (number)
    const body = {
      ...req.body,
      isUrgent: req.body.isUrgent === "true" || req.body.isUrgent === true,
      volunteersNeeded: Number(req.body.volunteersNeeded) || 1,
      honeyReward: Number(req.body.honeyReward) || 0,
    };

    // Validate with Joi
    const { error, value } = createRequestSchema.validate(body, {
      abortEarly: false, // collect ALL errors, not just the first one
    });

    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details.map((e) => e.message),
      });
    }

    // req.file is set by Multer if a file was uploaded
    // If no file was uploaded, heroImage stays null
    const heroImage = req.file
      ? `/uploads/requests/${req.file.filename}`
      : null;

    // Create the document in MongoDB
    const request = await Request.create({
      ...value,
      requesterId: req.user.id, // from the JWT token via auth middleware
      heroImage,
    });

    return res.status(201).json({
      success: true,
      message: "Request created successfully",
      data: request,
    });
  } catch (error) {
    next(error); // pass to global error handler
  }
};

// ─────────────────────────────────────────────────────────────────
// GET /requests
// Returns all open, non-flagged requests
// Supports: ?category=Gardening &search=hedge &isUrgent=true &page=1 &limit=10
// ─────────────────────────────────────────────────────────────────
const getRequests = async (req, res, next) => {
  try {
    const { category, search, isUrgent, page = 1, limit = 10 } = req.query;

    // Start with the base filter
    // Always exclude cancelled, closed, and admin-flagged tasks
    const query = {
      status: "open",
      flagged: false,
    };

    // Add filters only if they were provided in the query string
    if (category) query.category = category;
    if (isUrgent === "true") query.isUrgent = true;

    // $text search uses the index we defined on the schema
    // It searches across both title AND description simultaneously
    if (search) query.$text = { $search: search };

    // Pagination math
    // page=2, limit=10 means: skip the first 10, return the next 10
    const skip = (Number(page) - 1) * Number(limit);

    // Run two queries at the same time using Promise.all
    // Query 1: get the actual documents
    // Query 2: count total matching documents (for pagination info)
    const [requests, total] = await Promise.all([
      Request.find(query)
        .populate("requesterId", "name avatar trustScore hiveRating")
        // If searching, sort by text relevance score; otherwise, newest first
        .sort(search ? { score: { $meta: "textScore" } } : { createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(), // returns plain JS objects — faster for read-only
      Request.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      data: requests,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
        hasNextPage: Number(page) * Number(limit) < total,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────
// GET /requests/upcoming
// Returns accepted tasks for the logged-in volunteer
// Used by the Dashboard widget
// Note: Requires Application model — will be completed in Week 4
// ─────────────────────────────────────────────────────────────────
const getUpcomingRequests = async (req, res, next) => {
  try {
    // Placeholder — completed in Week 4 when Application model is built
    return res.status(200).json({ success: true, data: [] });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────
// GET /requests/:id
// Returns a single request with full requester details
// ─────────────────────────────────────────────────────────────────
const getRequestById = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id).populate(
      "requesterId",
      "name avatar trustScore hiveRating"
    );

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Hide flagged requests from regular users
    if (request.flagged && req.user?.role !== "admin") {
      return res.status(404).json({ message: "Request not found" });
    }

    return res.status(200).json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────
// PATCH /requests/:id
// Edit a request OR soft-cancel it (status = "cancelled")
// Only the requester who created it can do this
// ─────────────────────────────────────────────────────────────────
const updateRequest = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Ownership check
    // req.user.id comes from the JWT token
    // request.requesterId is the MongoDB ObjectId of who created it
    // .toString() converts ObjectId to string so we can compare them
    if (request.requesterId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not allowed to edit this request" });
    }

    const { error, value } = updateRequestSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details.map((e) => e.message),
      });
    }

    // { new: true } returns the updated document instead of the old one
    const updated = await Request.findByIdAndUpdate(
      req.params.id,
      { $set: value },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Request updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRequest,
  getRequests,
  getRequestById,
  getUpcomingRequests,
  updateRequest,
};