const jwt = require("jsonwebtoken");
const User = require("../Models/User");

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer "))
        return res.status(401).json({message: "No token provided"});

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_ACCESS_SECRET, async (err, decoded) => {
        if(err) return res.status(403).json({message: "Invalid token"});

        try {
            const user = await User.findById(decoded.id).select("-passwordHash");
            if(!user) return res.status(404).json({message: "User not found"});

            if(!user.isActive) return res.status(403).json({message: "Your account has been banned"});

            req.user = decoded;
            next();
        } catch(error) {
            next(error);
        }
    });
};

module.exports = verifyToken;