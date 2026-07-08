const mongoose = require("mongoose");

async function main() {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to DB");
}

module.exports = main;