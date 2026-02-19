const initData = require("./data.js");
const Listing = require("../models/listing.js");
const main = require("../config/dataBaseConfig.js");

const initDataBase = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data is Initialized");
}

main().then(() => {
    initDataBase();
})