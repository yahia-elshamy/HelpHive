const Joi = require("joi");

// Used for POST /requests (creating a new request)
const createRequestSchema = Joi.object({
  title: Joi.string().trim().min(5).max(100).required().messages({
    "string.min": "Title must be at least 5 characters",
    "string.max": "Title must be at most 100 characters",
    "any.required": "Title is required",
  }),

  description: Joi.string().trim().min(10).max(1000).required().messages({
    "string.min": "Description must be at least 10 characters",
    "string.max": "Description must be at most 1000 characters",
    "any.required": "Description is required",
  }),

  category: Joi.string()
    .valid("Gardening", "Tech Support", "Errands", "Repairs", "Pet Care")
    .required()
    .messages({
      "any.only": "Category must be one of the 5 available options",
      "any.required": "Category is required",
    }),

  locationName: Joi.string().trim().min(3).max(200).required().messages({
    "any.required": "Location is required",
  }),

  scheduledStart: Joi.date().iso().required().messages({
    "any.required": "Scheduled start time is required",
  }),

  scheduledEnd: Joi.date().iso().optional(),

  volunteersNeeded: Joi.number().integer().min(1).max(20).default(1),

  honeyReward: Joi.number().integer().min(0).max(500).default(0),

  isUrgent: Joi.boolean().default(false),
});

// Used for PATCH /requests/:id (editing an existing request)
// All fields are optional — you only send what you want to change
const updateRequestSchema = Joi.object({
  title: Joi.string().trim().min(5).max(100),
  description: Joi.string().trim().min(10).max(1000),
  locationName: Joi.string().trim().min(3).max(200),
  scheduledStart: Joi.date().iso(),
  scheduledEnd: Joi.date().iso(),
  volunteersNeeded: Joi.number().integer().min(1).max(20),
  honeyReward: Joi.number().integer().min(0).max(500),
  isUrgent: Joi.boolean(),
  status: Joi.string().valid("open", "closed", "cancelled"),
});

module.exports = { createRequestSchema, updateRequestSchema };