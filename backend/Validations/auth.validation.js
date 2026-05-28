const joi = require("joi");

const registerSchema = joi.object({
    name: joi.string().trim().min(3).max(50).required().messages({
        "string.min":"Name must be at least 3 characters",
        "string.max":"Name must be at most 50 characters",
        "any.required":"Name is required"
    }),
    email: joi.string().email().trim().lowercase().required().messages({
        "string.email":"Please enter a valid email address",
        "any.required":"Email is required"
    }),
    password: joi.string().min(8).max(64).required().messages({
        "string.min":"Password must be at least 8 characters",
        "string.max":"Password must be at most 64 characters",
        "any.required":"Password is required"
    }),
    role: joi.string().valid("requester", "volunteer").default("requester")
});

const loginSchema = joi.object({
    email: joi.string().email().trim().lowercase().required().messages({
        "string.email":"Please enter a valid email address",
        "any.required":"Email is required"
    }),
    password: joi.string().min(8).max(64).required().messages({
        "string.min":"Password must be at least 8 characters",
        "string.max":"Password must be at most 64 characters",
        "any.required":"Password is required"
    })
});

const forgotPasswordSchema = joi.object({
    email: joi.string().email().trim().lowercase().required().messages({
        "string.email": "Please enter a valid email address",
        "any.required": "Email is required"
    })
});

const resetPasswordSchema = joi.object({
    password: joi.string().min(8).max(64).required().messages({
        "string.min":"Password must be at least 8 characters",
        "string.max":"Password must be at most 64 characters",
        "any.required":"Password is required"
    })
})

module.exports = {registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema};