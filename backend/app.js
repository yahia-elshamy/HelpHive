// The app
const express = require("express");
const app = express();

// allow specific domain for the frontend to talk to backend, outside this domain will be blocked, and also allowing the credentials for transfering the cookies
const cors = require("cors");
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// parse json body from the request, and the "limit" to block requests more than 10kb to protect from DoS attacks or getting a big size payload that puts strain on the server
app.use(express.json({limit:"10kb"}));

// using morgan middleware to print the logging for every request in two shapes, one for the development and it's a simple format "dev", while the other "combined" is more informatic for the production
const morgan = require("morgan");
if(process.env.NODE_ENV === "production") {
    app.use(morgan("combined"));
} else {
    app.use(morgan("dev"));
}

// to read tokens from cookies
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Static files upload for images 
app.use("/uploads", express.static("uploads"));

// Routes
const authRoutes = require("./Routes/auth.routes");
app.use("/api/auth", authRoutes);
const requestRoutes = require("./Routes/request.routes");
app.use("/api/requests", requestRoutes);
const applicationRoutes = require("./Routes/application.routes");
app.use("/api/applications", applicationRoutes);
const reviewRoutes = require("./Routes/review.routes");
app.use("/api/reviews", requestRoutes);

// Error Handler Middleware
const errorHandler = require("./Middlewares/errorHandler.middleware");
app.use(errorHandler);

module.exports = app;