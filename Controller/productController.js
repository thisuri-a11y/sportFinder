import Product from "../Model/productModel.js";
import Shop from "../Model/shopModel.js";


// CREATE PRODUCT
export const createProduct = async(req,res)=>{

    try {

        const productData = new Product(req.body);

        const savedProduct = await productData.save();

        res.status(200).json(savedProduct);

    } catch (error) {

        res.status(500).json({error:"Internal Server Error."});

    }

}


// GET ALL PRODUCTS
export const fetchProducts = async(req,res)=>{

    try {

        const products = await Product.find().populate("shopId");

        res.status(200).json(products);

    } catch (error) {

        res.status(500).json({error:"Internal Server Error."});

    }

}


// SEARCH PRODUCTS BY DISTRICT
export const searchProducts = async(req,res)=>{

    try {

        const {product,district} = req.query;

        const shops = await Shop.find({
            district:district
        });

        const shopIds = shops.map(shop => shop._id);

        const products = await Product.find({

            productName:{
                $regex:product,
                $options:"i"
            },

            shopId:{
                $in:shopIds
            }

        }).populate("shopId");

        res.status(200).json(products);

    } catch (error) {

        res.status(500).json({error:"Internal Server Error."});

    }

}


// UPDATE PRODUCT
export const updateProduct = async(req,res)=>{

    try {

        const id = req.params.id;

        const productExist = await Product.findOne({_id:id});

        if(!productExist){

            return res.status(404).json({message:"Product not found."});

        }

        const updatedProduct = await Product.findByIdAndUpdate(id,req.body,{new:true});

        res.status(200).json(updatedProduct);

    } catch (error) {

        res.status(500).json({error:"Internal Server Error."});

    }

}


// DELETE PRODUCT
export const deleteProduct = async(req,res)=>{

    try {

        const id = req.params.id;

        const productExist = await Product.findOne({_id:id});

        if(!productExist){

            return res.status(404).json({message:"Product not found."});

        }

        await Product.findByIdAndDelete(id);

        res.status(200).json({message:"Product deleted successfully."});

    } catch (error) {

        res.status(500).json({error:"Internal Server Error."});

    }

}