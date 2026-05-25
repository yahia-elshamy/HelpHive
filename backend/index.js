require("dotenv").config();

const express = require("express");
const app = express();

const mongoose = require("mongoose");

const port = process.env.PORT || 3000;

// allow frontend to talk to backend even if the domain is different
const cors = require("cors");
app.use(cors());

// parse json body from the request, and the "limit" to block requests more than 10kb to protect from DoS attacks or getting a big size payload that puts strain on the server
app.use(express.json({limit:"10kb"}));

// using morgan middleware to print the logging for every request to better development
const morgan = require("morgan");
app.use(morgan("dev"));

const connectDB = require("./Config/db");
connectDB();

const errorHandler = require("./Middlewares/errorHandler");
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});