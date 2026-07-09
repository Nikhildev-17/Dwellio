const path = require("path");

require("dotenv").config({
    path: path.resolve(__dirname, "../.env")
});

const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user");
const main = require("../config/dataBaseConfig.js");

const initDataBase = async () => {

    await Listing.deleteMany({});

    const user = await User.findOne({ username: "Nikhil" });

    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: user._id,
    }));

    await Listing.insertMany(initData.data);

    console.log("Data Initialized");
}

main()
    .then(() => initDataBase())
    .catch(console.log);