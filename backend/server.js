// require .env configuration file
require("dotenv").config();

// require the app
const app = require("./app");

// require the DB connection function and connect to the DB
const connectDB = require("./Config/db");
connectDB();

// listen on the app 
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
