const mongoose = require("mongoose");

const connectDB = async () =>{
    console.log("Connecting to MongoDB");
    await mongoose.connect("mongodb+srv://pradyumna05:wguddxqR0CKGZSmD@cluster0.tjsvtdz.mongodb.net/devConnect");
    console.log("Connected to MongoDB");
};

module.exports = {connectDB};