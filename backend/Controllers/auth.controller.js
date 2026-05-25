const bcrypt = require("bcrypt");
const User = require("../Models/User");
const {registerSchema} = require("../Validations/auth.validation");
const {generateAccessToken, generateRefreshToken} = require("../Utils/token.utils");

const register = async (req, res) => {
    try{
        const {error, value} = registerSchema.validate(req.body, {abortEarly: false});
        if (error)
            return res.status(400).json({
                message: "Validation failed",
                errors: error.details.map((e)=>e.message)
            });

        const {name, email, password, role} = value;

        const existingUser = await User.findOne({email});
        if(existingUser)
            return res.status(409).json({message: "Email is already registered"});

        const passwordHash = await bcrypt.hash(password, 12);

        const avatar = req.file ?  `/uploads/avatar/${req.file.filename}` : null;

        const user = await User.create({
            name,
            email,
            passwordHash,
            role,
            avatar
        });

        const accessToken = generateAccessToken(user._id, user.role);
        const refreshToken = generateRefreshToken(user._id);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            message: "User registerd successfully",
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }
        });
    } catch(error) {
        next(error);
    }
};

module.exports = {register};