const mongoose = require("mongoose");
const bookingschema = new mongoose.Schema({
    title: {
        type:String,
        required:true,
        
    },
    description: String,
    image:{
        url:{
        type:String,
        default:
            "https://images.unsplash.com/photo-1785309325141-dd4c1fb7b3b9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D",
        
        set:(v)=> 
            v===""
        ?"https://images.unsplash.com/photo-1785309325141-dd4c1fb7b3b9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D"
        :v,
    },
},
    price: Number,
    location: String,
    country: String,
});

const listing = mongoose.model("listing",bookingschema);
module.exports = listing;