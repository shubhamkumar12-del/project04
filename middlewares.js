const Listing = require("./models/listing.js");
const AxpressError = require("./utils/AxpressError.js");
const {ListingSchema} = require("./schema.js");
const {reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");


module.exports.isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
         req.session.redirectUrl = req.originalUrl;
         req.flash("error", "You must be logged in");
         return res.redirect("/login");
      }
      next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
       if(req.session.redirectUrl){
         res.locals.redirectUrl = req.session.redirectUrl;
       }
       next();
}


//authorization
module.exports.isOwner = async(req,res,next)=>{
  let{id} = req.params;
  const listing = await Listing.findById(id);
   if(!listing.owner.equals(req.user._id)){
    req.flash("error", "You are not owner!");
     return res.redirect(`/listings/${id}`);
   }
   next();
}

//validation
module.exports.validateListing = (req, res, next)=>{
      let{error} = ListingSchema.validate(req.body);
  
   if(error){
    let errMsg = error.details.map((el) =>el.message).join(",");
    throw new AxpressError(400, errMsg);
   }else{
      next();
   }
}

//review validation
module.exports.validateReview = (req, res, next)=>{
      let{error} = reviewSchema.validate(req.body);
  
   if(error){
    let errMsg = error.details.map((el) =>el.message).join(",");
    throw new AxpressError(400, errMsg);
   }else{
      next();
   }
}


module.exports.isReviewAuthor = async(req,res,next)=>{
  let{id,reviewId} = req.params;
  const review = await Review.findById(reviewId);
   if(!review.author.equals(req.user._id)){
    req.flash("error", "You are not authorized!");
     return res.redirect(`/listings/${id}`);
   }
   next();
}