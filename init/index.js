const mongoose = require("mongoose");
const initdata = require("./data.js");
const listing = require("../models/listing.js");
 
const dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wonderlust";

main().then(()=>{
    console.log("connect to db");
}).catch(err=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(dbUrl);
}



const initdb =  async ()=>{
     await listing.deleteMany({});
     initdata.data = initdata.data.map((obj)=>({...obj,
      owner:"6ab41df324fd5908d21e1409",
    }));
     await listing.insertMany(initdata.data);
    console.log("save");

}
initdb();