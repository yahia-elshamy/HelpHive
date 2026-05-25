const mongoose = require("mongoose");

const connectDB = async (retries = 5, delay = 3000) => {
    while(retries) {
        try {
            await mongoose.connect(process.env.MONGO_URI);
            console.log("DB is connected successfully");
            
            return;

        } catch(error) {
            retries -= 1;
            console.error(`DB is failed to connect. Retries left: ${retries}`);
            
            if(!retries) {
                console.error(`Can't connect to the DB after multiple attempts`);
                process.exit(1);
            }
            
            await new Promise((res) => setTimeout(res.delay));
        }
    }
};

module.exports = connectDB;