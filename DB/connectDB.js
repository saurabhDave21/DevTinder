const mongoose = require("mongoose");

const url = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(url);
        console.log("Successfully connected to DB");
    } catch (err) {
        console.error("DB connection error:", err.message);
        process.exit(1);
    }
};

connectDB();
module.exports = connectDB;