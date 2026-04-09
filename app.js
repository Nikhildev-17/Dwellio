const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const main = require("./config/dataBaseConfig.js");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
main();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
    res.send("Working");
})

app.get("/listings", wrapAsync(async (req, res) => {

    const allListings = await Listing.find({});
    res.render("listings/index", {allListings});

}));

app.get("/listings/new", (req, res) => {
    res.render("listings/forms.ejs");
});

app.get("/listings/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    let listingById = await Listing.findById(id);
    res.render("listings/show", {listingById});
}));

app.post("/listings",  wrapAsync(async (req, res) => {
    if(!req.body.listing){
        throw new ExpressError(400, "Bad Request!");
    }
    let newListing = req.body;
    let addNewListing = new Listing(newListing);
    await addNewListing.save();
    res.redirect("/listings");
}));

app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let {id} = req.params;
    let oldListing = await Listing.findById(id);
    res.render("listings/edit.ejs", {oldListing});
}));

app.put("/listings/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, req.body);
    res.redirect(`/listings/${id}`);
}));

app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
})

app.use((err, req, res, next) => {
    if(err.name === "CastError"){
        err = new ExpressError(400, "Invalid Id");
    }
    let {status = 500, message = "Something went wrong!"} = err;
    res.status(status).send(message);
})

app.listen(3000, () => {
    console.log("Server running on port : 3000");
});