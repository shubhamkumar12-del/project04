const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const AxpressError = require("../utils/AxpressError.js");

const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isAuthor, isReviewAuthor } = require("../middlewares.js");



    

   //review route
   router.post("/",isLoggedIn, validateReview, wrapAsync(async(req, res)=>{
   console.log(req.params.id);
       let{id} = req.params;
       let listing = await Listing.findById(id);
       if(!listing){
        throw new AxpressError(404,"listing not found");
       }
       let newReview = new Review(req.body.review);
         newReview.author = req.user._id;
       listing.reviews.push(newReview);

       await newReview.save();
       await listing.save();
        req.flash("success", "New Reviews Created");
       res.redirect(`/listings/${id}`);
       console.log("save");
   }));

   //delete review route
   router.delete("/:reviewId",isReviewAuthor, wrapAsync(async(req,res)=>{
      let{id, reviewId} = req.params;
      await Listing.findByIdAndUpdate(id, { $pull: {reviews: reviewId}});
       await Review.findByIdAndDelete(reviewId);
        req.flash("success", "Reviews Deleted");
      
      res.redirect(`/listings/${id}`);
   }));

   module.exports = router;