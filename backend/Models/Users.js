const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlingth: 8
    },
    role: {
        type: String,
        enum: ["requester", "volunteer", "admin"]
    }
}, {timestamps: true});

const Users = mongoose.model("Users", usersSchema);
module.exports = Users;