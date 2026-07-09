require("dotenv").config();

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const userRouter = require("./routes/user");
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const main = require("./config/dataBaseConfig.js");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingsSchema } = require("./schema.js");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const { isLoggedIn, isOwner } = require("./routes/middleware.js");
main();



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.currUser = req.user;
    next();
});



const validateListing = (req, res, next) => {
    let { error } = listingsSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

app.use("/", userRouter);

app.get("/", (req, res) => {
    res.redirect("/listings");
})

app.get("/listings", wrapAsync(async (req, res) => {

    const allListings = await Listing.find({});
   
    
    res.render("listings/index", {allListings});

}));

app.get("/listings/new", isLoggedIn, isOwner, (req, res) => {
    res.render("listings/forms.ejs");
});

app.get("/listings/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    let listingById = await Listing.findById(id);
    res.render("listings/show", {listingById});
}));

app.post("/listings", isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {


    let newListing = req.body;
    let addNewListing = new Listing(newListing);
    addNewListing.owner = req.user._id;
    await addNewListing.save();
    res.redirect("/listings");
}));

app.get("/listings/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let {id} = req.params;
    let oldListing = await Listing.findById(id);
    res.render("listings/edit.ejs", {oldListing});
}));

app.put("/listings/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, req.body);
    res.redirect(`/listings/${id}`);
}));

app.delete("/listings/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
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
    res.status(status).render("error.ejs", {err});
})

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});