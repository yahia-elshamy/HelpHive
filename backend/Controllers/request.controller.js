const Request = require("../Models/Request");
const { createRequestSchema, updateRequestSchema } = require("../Validations/request.validation");


// Creates a new help request
const createRequest = async (req, res, next) => {
  try {
    const heroImage = req.file ? `/uploads/requests/${req.file.filename}` : null;

    const { error, value } = createRequestSchema.validate(req.body, {abortEarly: false, stripUnknown: true});

    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details.map((e) => e.message),
      });
    }

    const newRequest = await Request.create({
      ...value,
      requesterId: req.user.id, // from the JWT token in auth middleware
      heroImage,
    });

    return res.status(201).json({
      success: true,
      message: "Request created successfully",
      data: newRequest,
    });
  } catch (error) {
    next(error);
  }
};

// Returns all open, non-flagged requests
const getRequests = async (req, res, next) => {
  try {
    const { category, search } = req.query;

    // Always exclude cancelled, closed, and admin-flagged tasks
    const query = {
      status: "open",
      flagged: false,
    };

    if (category) query.category = category;

    if (search) query.$text = { $search: search };

    const requests = await Request.find(query)
    .populate("requesterId", "name avatar trustScore hiveRating")
    .sort({createdAt: -1})
    .lean();

    return res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    next(error);
  }
};

// Returns a single request with full requester details
const getRequestById = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id).populate("requesterId", "name avatar trustScore hiveRating").lean();

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.flagged && req.user?.role !== "admin") {
      return res.status(404).json({ message: "Request not found" });
    }

    return res.status(200).json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
};

// Edit a request, Only the requester who created it can do this
const updateRequest = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.requesterId.toString() !== req.user.id)
      return res.status(403).json({ message: "You are not allowed to edit this request" });

    const { error, value } = updateRequestSchema.validate(req.body, {abortEarly: false, stripUnknown: true});

    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details.map((e) => e.message),
      });
    }

    if(req.file) {
      value.heroImage = `uploads/requests/${req.file.filename}`;
    }

    const updated = await Request.findByIdAndUpdate(
      req.params.id,
      { $set: value },
      { new: true, runValidators: true }
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

// Delete a request, Only the requester who created it can do this
const deleteRequest = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id);

    if(!request) return res.status(404).json({message: "Request no found"});

    if(request.requesterId.toString() !== req.user.id)
      return res.status(403).json({message: "You are not allowed to delete this request"});

    const updatedRequest = await Request.findByIdAndUpdate(req.params.id, {status: "cancelled"});

    res.status(200).json({
      success: true,
      message: "This request has been closed",
      data: updatedRequest
    })

  }catch(error){
    next(error);
  }
}

module.exports = {
  createRequest,
  getRequests,
  getRequestById,
  updateRequest,
  deleteRequest
};