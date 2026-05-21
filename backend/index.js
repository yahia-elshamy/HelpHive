require("dotenv").config();

const express = require("express");
const app = express();

const mongoose = require("mongoose");

const port = process.env.PORT || 3000;
const mongo_uri = process.env.MONGO_URI;

app.use(express.json());

const dbConnection = async (req, res) => {
    try {
        await mongoose.connect(mongo_uri);
        console.log("Connected Successfully");
    } catch(error) {
        console.log(`Server is failed to connect due to error: ${error}`);
    }
}

dbConnection();

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});