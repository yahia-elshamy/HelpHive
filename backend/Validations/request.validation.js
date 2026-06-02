const joi = require("joi");

const createRequestSchema = joi.object({
    title: joi.string().trim().min(5).max(100).required().messages({
    "string.min": "Title must be at least 5 characters",
    "string.max": "Title must be at most 100 characters",
    "any.required": "Title is required"
    }),
    description: joi.string().trim().min(10).max(1000).required().messages({
    "string.min": "Description must be at least 10 characters",
    "string.max": "Description must be at most 1000 characters",
    "any.required": "Description is required"
    }),
    category: joi.string().valid("Gardening", "Tech Support", "Errands", "Repairs", "Pet Care").required().messages({
    "any.only": "Category must be one of: Gardening, Tech Support, Errands, Repairs, Pet Care",
    "any.required": "Category is required"
    }),
    locationName: joi.string().trim().min(3).max(200).required().messages({
    "string.min": "Location must be at least 3 characters",
    "any.required": "Location is required"
    }),
    scheduledStart: joi.date().iso().greater("now").required().messages({
    "date.greater": "Scheduled start must be in the future",
    "any.required": "Scheduled start is required"
    }),
    scheduledEnd: joi.date().iso().greater(joi.ref("scheduledStart")).optional().messages({
    "date.greater": "Scheduled end must be after scheduled start"
    }),
    volunteersNeeded: joi.number().integer().min(1).max(20).default(1),
    honeyReward: joi.number().integer().min(0).max(500).default(0),
    isUrgent: joi.boolean().default(false)
});

const updateRequestSchema = joi.object({
    title: Joi.string().trim().min(5).max(100),
    description: Joi.string().trim().min(10).max(1000),
    locationName: Joi.string().trim().min(3).max(200),
    scheduledStart: Joi.date().iso(),
    scheduledEnd: Joi.date().iso(),
    volunteersNeeded: Joi.number().integer().min(1).max(20),
    honeyReward: Joi.number().integer().min(0).max(500),
    isUrgent: Joi.boolean(),
    status: Joi.string().valid("open", "closed", "cancelled")
});

module.exports = {createRequestSchema, updateRequestSchema};