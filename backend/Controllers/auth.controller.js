const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../Models/User");
const {registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema} = require("../Validations/auth.validation");
const {generateAccessToken, generateRefreshToken} = require("../Utils/token.utils");
const transporter = require("../Config/nodemailer");

const register = async (req, res, next) => {
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
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            message: "User registered successfully",
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

const login = async (req, res, next) => {
    try {
        const {error, value} = loginSchema.validate(req.body, {abortEarly: false});
        if (error)
            return res.status(400).json({
                message: "Validation failed",
                errors: error.details.map((e)=>e.message)
            });

        const {email, password} = value;

        const user = await User.findOne({email});
        if(!user) 
            return res.status(400).json({message: "Invalid email or password"});

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if(!isMatch) 
            return res.status(400).json({message: "Invalid email or password"});

        const accessToken = generateAccessToken(user._id, user.role);
        const refreshToken = generateRefreshToken(user._id);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: "Login successful",
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

const refreshAccessToken = async (req, res, next) => {
    try {
        const token = req.cookies.refreshToken;

        if(!token)
            return res.status(401).json({message: "No refresh token provided"});

        jwt.verify(token, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
            if (err) return res.status(403).json({message: "Invalid refresh token"});
            
            const user = await User.findById(decoded.id);
            if(!user)
                return res.status(404).json({message: "User not found"});
            
            const newAccessToken = generateAccessToken(user._id, user.role);
            
            return res.json({
                message: "Access token refreshed",
                accessToken: newAccessToken
            });
        });
            
    } catch(error) {
        next(error);
    }
}

const logout = (req, res) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
    });

    return res.json({message: "Logged out successfully"});
}

const forgotPassword = async (req, res, next) => {
    try {
        const {error, value} = forgotPasswordSchema.validate(req.body, {abortEarly: false});
        if(error) 
            return res.status(400).json({
                message: "Validation failed",
                errors: error.details.map((e)=> e.message)
            });

        const {email} = value;

        const user = await User.findOne({email});
        if(!user)
            return res.status(200).json({message: "If that email exists, a reset link has been sent"});

        const rawToken = crypto.randomBytes(32).toString("hex");

        const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
        await user.save();

        // send email with rawToken in reset link, by now we return in directly in the dev stage only
        console.log(`Reset token for ${email}: ${rawToken}`);

        return res.status(200).json({
            message: "If that email exists, a reset link has been sent",
            devToken: rawToken
        });
    } catch(error) {
        next(error);
    }
};

const resetPassword = async (req, res, next) => {
    try {
        const {error, value} = resetPasswordSchema.validate(req.body, {abortEarly: false});
        if(error) 
            return res.status(400).json({
                message: "Validation failed",
                errors: error.details.map((e)=> e.message)
            });

            const {password} = value;
            const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

            const user = await User.findOne({
                resetPasswordToken: hashedToken,
                resetPasswordExpires: {$gt: Date.now()}
            });

            if(!user) return res.status(400).json({message: "Token is invalid or has expired"});

            user.passwordHash = await bcrypt.hash(password, 12);

            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            await user.save();

            return res.status(200).json({message: "Password reset successfully"});

    } catch(error) {
        next(error);
    }
};

module.exports = {register, login, refreshAccessToken, logout, forgotPassword, resetPassword};