const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        enum: ["text", "image"],
        default: "text"
    },
    content: {
        type: String,
        default: "",
        minlength: 1,
        maxlength: 1000,
        trim: true
    },
    imageUrl: {
        type: String,
        default: null
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

messageSchema.index({chatId: 1, createdAt: 1});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;