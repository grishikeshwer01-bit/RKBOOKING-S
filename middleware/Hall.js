const mongoose = require("mongoose");

const hallSchema = new mongoose.Schema({

    hallName:String,

    state:String,

    district:String,

    mandal:String,

    price:Number,

    available:{
        type:Boolean,
        default:true
    }

});

module.exports = mongoose.model("Hall",hallSchema);