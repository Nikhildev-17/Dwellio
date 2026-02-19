const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const main = require("./config/dataBaseConfig.js");
main();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

app.get("/", (req, res) => {
    res.send("Working");
})

app.get("/listings", async (req, res) => {

    const allListings = await Listing.find({});
    res.render("listings/index", {allListings});

});

app.get("/listings/new", (req, res) => {
    res.render("listings/forms.ejs");
});

app.get("/listings/:id", async (req, res) => {
    let {id} = req.params;
    let listingById = await Listing.findById(id);
    res.render("listings/show", {listingById});
});

app.post("/listings", async (req, res) => {
    let newListing = req.body;
    let addNewListing = new Listing(newListing);
    await addNewListing.save();
    res.redirect("/listings");
})

app.get("/listings/:id/edit", async (req, res) => {
    let {id} = req.params;
    let oldListing = await Listing.findById(id);
    res.render("listings/edit.ejs", {oldListing});
});

app.put("/listings/:id", async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, req.body);
    res.redirect(`/listings/${id}`);
});

app.delete("/listings/:id", async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});

app.listen(3000, () => {
    console.log("Server running on port : 3000");
});