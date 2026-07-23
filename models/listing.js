const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String
    },
    image : {
        filename : String,
        url : {
            type : String,
            default : "https://plus.unsplash.com/premium_photo-1676823553207-758c7a66e9bb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDl8TThqVmJMYlRSd3N8fGVufDB8fHx8fA%3D%3D",
            set : (v) => {
                if(v === ""){
                    return "https://plus.unsplash.com/premium_photo-1676823553207-758c7a66e9bb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDl8TThqVmJMYlRSd3N8fGVufDB8fHx8fA%3D%3D";
                }
                return v;
            }
        }
    },
    price : Number,
    location : String,
    country : String,

    reviews : [{
        type : Schema.Types.ObjectId,
        ref : "Review"
    }],

    owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
}
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;