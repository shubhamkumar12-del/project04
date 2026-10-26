const express = require("express");
const router =express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares.js");



router.get("/signup",(req,res)=>{
    res.render("listing/users/signup.ejs");
});

router.post("/signup",async(req,res,next)=>{
    try{
        const{email,password,username} = req.body;
        const newuser = new User({
         username: username,
        email: email
    });

    const resistered = await User.register(newuser, password);
    
    req.login(resistered, (err)=>{
        if(err){
            return next(err);
        }
         req.flash("success","welcome to wonderlust");
         res.redirect("/listings");
    });
   
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
    
})

router.get("/login",(req,res)=>{
  res.render("listing/users/login.ejs");
});

router.post(
    "/login", saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash:true,
    }),
   async (req, res) => {
         req.flash("success","welcome to wonderlust");
        res.redirect( res.locals.redirectUrl || "listings");
    }
);

router.get("/logout",(req,res)=>{
    req.logOut((err)=>{
        if(err){
            return next(err.message);
        }
        req.flash("success","Logged you out!");
        res.redirect("/listings");
    });
});

module.exports = router;