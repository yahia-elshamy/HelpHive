const joi = require("joi");

const createApplicationSchema = joi.object({
    requestId: joi.string().hex().length(24).required().messages({
        "string.length": "Request ID must be a valid 24-character ID",
        "any.required": "Request ID is required to apply"
    })
});

module.exports = { createApplicationSchema };