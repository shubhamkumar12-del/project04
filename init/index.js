const mongoose = require("mongoose");
const initdata = require("./data.js");
const listing = require("../models/listing.js");


main().then(()=>{
    console.log("connect to db");
}).catch(err=>{
    console.log(err);
});
// async function main(){
//     await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
// }
const dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wonderlust";
await mongoose.connect(dbUrl);

const initdb =  async ()=>{
     await listing.deleteMany({});
     await listing.insertMany(initdata.data);
    console.log("savee");

}
initdb();