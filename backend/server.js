// require .env configuration file
require("dotenv").config();

// require the socket.io server 
const http = require("http");
const {Server} = require("socket.io");
// require the app
const app = require("./app");

//create the server using app
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

const notificationService = require("./Utils/notificationService.js");
notificationService.init(io);

io.on("connection", (socket)=>{
    const userId = socket.handshake.query.userId;

    if(userId) {
        socket.join(`user:${userId}`);
        console.log(`User ${userId} is online and joined their private room.`);
    };

    socket.on("join_chat", (chatId)=>{
        socket.join(`chat:${chatId}`);
        console.log(`Socket ${socket.id} joined chat room: ${chatId}`);
        socket.emit("joined_success", {room: chatId});
    });
    
    socket.on("send_message", (data)=>{
        const {chatId, message} = data;
        io.to(`chat:${chatId}`).emit("receive_message", {
            senderId: userId,
            text: message,
            timestamp: new Date()
        });
    });
    
    socket.on("disconnect", ()=>{
        console.log("User disconnected: ", socket.id);
    });
});

// require the DB connection function and connect to the DB
const connectDB = require("./Config/db");
connectDB();

// listen on the app 
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
