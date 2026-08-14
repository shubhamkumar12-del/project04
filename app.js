const express= require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const path =require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")) )


main().then(()=>{
    console.log("connect to db");
}).catch(err=>{
    console.log(err);
});
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
}

app.get("/",async (req,res)=>{
     const alllistings = await listing.find({});
    res.render("listing/index.ejs",{alllistings});
    });

    // res.send("hy");
// });

// app.get("/testlistining",async (req,res)=>{
//     let sample = new listing({
//         title:"My new villas",
//         description:"by the beach",
//         price:1200,
//         location:"goa",
//         country:"india",
//     });
//     await sample.save();
//     console.log("sample has saved");
//     res.send("successfull");
// });
app.get("/listings",async (req,res)=>{
    const alllistings = await listing.find({});
    res.render("listing/index.ejs",{alllistings});
    });

    app.get("/listings/new",(req,res)=>{
    res.render("listing/new.ejs");
  });

  app.get("/listings/:id",async (req,res)=>{
       let {id} = req.params;
       const listingss= await listing.findById(id);
       res.render("listing/show.ejs",{listingss});
  });  

  //create route
  app.post("/listings",async (req,res)=>{
    const newlisting = new listing(req.body.listing);
    await newlisting.save();
    console.log(listing);
    res.redirect("/listings");
  });

  //edit route
  app.get("/listings/:id/edit",async (req,res)=>{
    let{id} = req.params;
    const listinges = await listing.findById(id);
    res.render("listing/edit.ejs",{listinges});
  });
   
  //update route
  app.put("/listings/:id",async (req,res)=>{
        let{id} = req.params;
        await listing.findByIdAndUpdate(id,{...req.body.listing});
      res.redirect(`/listings/${id}`);
  });

  //delete route
   app.delete("/listings/:id",async (req,res)=>{
       let{id} = req.params;
       await listing.findByIdAndDelete(id);
       res.redirect("/listings");
   })
app.listen(8080,()=>{
    console.log("sever listen");
});