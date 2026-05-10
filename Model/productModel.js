import mongoose from "mongoose";

const productSchema = new mongoose.Schema({

    productName:{
        type:String,
        required:true
    },

    brand:{
        type:String,
        required:true
    },

    category:{
        type:String,
        required:true
    },

    price:{
        type:Number,
        required:true
    },

    availability:{
        type:Boolean,
        default:true
    },

    shopId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"shops",
        required:true
    }

});

export default mongoose.model("products",productSchema);