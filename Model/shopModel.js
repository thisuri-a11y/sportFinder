import mongoose from "mongoose";

const shopSchema = new mongoose.Schema({

    shopName:{
        type:String,
        required:true
    },

    district:{
        type:String,
        required:true
    },

    address:{
        type:String,
        required:true
    },

    contactNumber:{
        type:String,
        required:true
    }

});

export default mongoose.model("shops",shopSchema);