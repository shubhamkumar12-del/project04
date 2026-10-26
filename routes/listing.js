const express = require("express");
const router =express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");

const {isLoggedIn, isOwner, validateListing } = require("../middlewares.js");
const multer  = require('multer');
const {storage} = require("../cloudeConfig.js");
const upload = multer({ storage });

//geocodeing
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken= process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken: mapToken});



router.route("/")
.get(wrapAsync(async (req,res)=>{
    const alllistings = await Listing.find({});
    res.render("listing/index.ejs",{alllistings});
    }))
.post(isLoggedIn,validateListing,upload.single("listing[image]"),
wrapAsync(async (req,res, next)=>{

  console.log("POST LISTING ROUTE HIT");

  let response = await geocodingClient
    .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    })
    .send();

    if (!response.body.features.length) {
    req.flash("error", "Location not found. Please enter a valid location.");
    return res.redirect("/listings/new");
}
    
   
     let url = req.file.path;
     let filename = req.file.filename;
    
    const newlisting = new Listing(req.body.listing);
     newlisting.owner = req.user._id;
    newlisting.image = {url, filename};

    

    newlisting.geometry = {
    type: "Point",
    coordinates: response.body.features[0].geometry.coordinates
};

console.log("GEOMETRY:", newlisting.geometry);
console.log("TYPE:", newlisting.geometry.type);
    await newlisting.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
  }));




   router.get("/new", isLoggedIn, (req,res)=>{
     res.render("listing/new.ejs");
  });




  router.route("/:id")
  .get(wrapAsync(async (req,res)=>{
       let {id} = req.params;
       const listingss= await Listing.findById(id)
       .populate({path:"reviews",
         populate:{
            path:"author",
         },
      })
         .populate("owner");
       if(!listingss){
         req.flash("error", "Listing does not exist");
          return res.redirect("/listings");
       }
       
       res.render("listing/show.ejs",{listingss});
  }))
  .put(
   isLoggedIn,
   isOwner,
   upload.single("listing[image]"),
    validateListing,
    
    wrapAsync(async (req,res)=>{
         let{id} = req.params;
         let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
          
         if(typeof req.file !== "undefined"){
          let url = req.file.path;
          let filename = req.file.filename;
          listing.image = {url, filename};
          await listing.save();

         }
         

         req.flash("success", "Listing Udated");
         res.redirect(`/listings/${id}`);
  }))
  .delete(isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
       let{id} = req.params;
       await Listing.findByIdAndDelete(id);
        req.flash("success", "Listing Deleted");
       res.redirect("/listings");
   }));



router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
    let{id} = req.params;
    const listinges = await Listing.findById(id);
      if(!listinges){
         req.flash("error", "Listing does not exist");
          return res.redirect("/listings");
       }
       let originalImage = listinges.image.url;
       originalImage = originalImage.replace("/upload", "/upload/h_150,w_200");
    res.render("listing/edit.ejs",{listinges, originalImage});
  }));


module.exports = router;

// router.get("/",wrapAsync(async (req,res)=>{
//     const alllistings = await Listing.find({});
//     res.render("listing/index.ejs",{alllistings});
//     }));


//     router.get("/new", isLoggedIn, (req,res)=>{
//      res.render("listing/new.ejs");
//   });

//  router.get("/:id",wrapAsync(async (req,res)=>{
//        let {id} = req.params;
//        const listingss= await Listing.findById(id)
//        .populate({path:"reviews",
//          populate:{
//             path:"author",
//          },
//       })
//          .populate("owner");
//        if(!listingss){
//          req.flash("error", "Listing does not exist");
//           return res.redirect("/listings");
//        }
//        console.log(listingss);
//        res.render("listing/show.ejs",{listingss});
//   }));  

  //create route
//   router.post("/",isLoggedIn,validateListing,wrapAsync(async (req,res, next)=>{
  
//     const newlisting = new Listing(req.body.listing);
//     newlisting.owner = req.user._id;
//     await newlisting.save();
//     req.flash("success", "New Listing Created");
//     res.redirect("/listings");
//   }));

  //edit route
// router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
//     let{id} = req.params;
//     const listinges = await Listing.findById(id);
//       if(!listinges){
//          req.flash("error", "Listing does not exist");
//           return res.redirect("/listings");
//        }
//     res.render("listing/edit.ejs",{listinges});
//   }));
   
  //update route
// router.put("/:id",
//    isLoggedIn,
//    isOwner,
//     validateListing,
    
//     wrapAsync(async (req,res)=>{
//          let{id} = req.params;
//          await Listing.findByIdAndUpdate(id,{...req.body.listing});
//          req.flash("success", "Listing Udated");
//          res.redirect(`/listings/${id}`);
//   }));

  //delete route
   // router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
   //     let{id} = req.params;
   //     await Listing.findByIdAndDelete(id);
   //      req.flash("success", "Listing Deleted");
   //     res.redirect("/listings");
   // }));



// module.exports = router;