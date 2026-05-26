require("dotenv").config();

const express = require("express");
const app = express();

const port = process.env.PORT || 3000;

// allow specific domain for the frontend to talk to backend, outside this domain will be blocked, and also allowing the credentials for transfering the cookies
const cors = require("cors");
app.use(cors({
    origin: "http://localhost:5173/",
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

const connectDB = require("./Config/db");
connectDB();

const cookieParser = require("cookie-parser");
const authRoutes = require("./Routes/auth.routes");

app.use(cookieParser());
app.use("/uploads", express.static("uploads"));
app.use("/auth", authRoutes);

const errorHandler = require("./Middlewares/errorHandler.middleware");
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});