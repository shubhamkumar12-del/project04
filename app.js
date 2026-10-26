// if(process.env.NODE_ENV!="production"){
//     require("dotenv").config();
// }
require("dotenv").config();
console.log("MAP TOKEN:", process.env.MAP_TOKEN);



const express= require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js");
const AxpressError = require("./utils/AxpressError.js");
// const {ListingSchema, reviewSchema} = require("./schema.js");
// const Review = require("./models/review.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");




app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")) );

const dbUrl = process.env.ATLASDB_URL;

main().then(()=>{
    console.log("connect to db");
}).catch(err=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(dbUrl);
}

// app.get("/",async (req,res)=>{
//     res.send("hy");
// });
    const store = MongoStore.create({
        mongoUrl:dbUrl,
        crypto: {
            secret:process.env.SECRET,
        },
        touchAfter: 24*3600,
    });
    store.on("error",(error)=>{
        console.log("ERROR IN MONOGO STORE", err);
    });

    app.use(session({
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
}));


    

    app.use(flash());
    //passport initialization
    app.use(passport.initialize());
    app.use(passport.session());
    
    passport.use(new LocalStrategy(User.authenticate()));
    

    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    //use middleware
    app.use((req, res, next)=>{
        res.locals.success = req.flash("success");
        res.locals.error = req.flash("error");
        res.locals.curruser = req.user;
       
        next();
    });
    

     app.use("/listings", listingRouter);
     app.use("/listings/:id/reviews", reviewRouter);
     app.use("/",userRouter);

  

   app.all(/.*/, (req, res, next)=>{
    next(new AxpressError(400, "Page not found!"));
   });

   //error handle
   app.use((err, req, res, next)=>{
    let{statusCode=500, message="something went wrong"} = err;
    //   res.render("listing/Error.ejs");
      res.status(statusCode).render("listing/Error.ejs", {message});
      
   });
app.listen(8080,()=>{
    console.log("sever listen");
});