const mongoose=require("mongoose");

const travelSchema=new mongoose.Schema({

    place:String,

    state:String,

    price:Number,

    days:Number

});

module.exports=mongoose.model("Travel",travelSchema);
