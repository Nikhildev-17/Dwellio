const mongoose = require("mongoose");
const Mongodb_URL = "mongodb://127.0.0.1:27017/StayHub";

const main = async () => {
    await mongoose.connect(Mongodb_URL);
}

main().then(() => {
    console.log("conected to DB");
}).catch((err) => {
    console.log(err);
});

module.exports = main;