import Shop from "../Model/shopModel.js";


// CREATE SHOP
export const createShop = async(req,res)=>{

    try {

        const shopData = new Shop(req.body);

        const savedShop = await shopData.save();

        res.status(200).json(savedShop);

    } catch (error) {

        res.status(500).json({error:"Internal Server Error."});

    }

}


// GET ALL SHOPS
export const fetchShops = async(req,res)=>{

    try {

        const shops = await Shop.find();

        res.status(200).json(shops);

    } catch (error) {

        res.status(500).json({error:"Internal Server Error."});

    }

}


// UPDATE SHOP
export const updateShop = async(req,res)=>{

    try {

        const id = req.params.id;

        const shopExist = await Shop.findOne({_id:id});

        if(!shopExist){

            return res.status(404).json({message:"Shop not found."});

        }

        const updatedShop = await Shop.findByIdAndUpdate(id,req.body,{new:true});

        res.status(200).json(updatedShop);

    } catch (error) {

        res.status(500).json({error:"Internal Server Error."});

    }

}


// DELETE SHOP
export const deleteShop = async(req,res)=>{

    try {

        const id = req.params.id;

        const shopExist = await Shop.findOne({_id:id});

        if(!shopExist){

            return res.status(404).json({message:"Shop not found."});

        }

        await Shop.findByIdAndDelete(id);

        res.status(200).json({message:"Shop deleted successfully."});

    } catch (error) {

        res.status(500).json({error:"Internal Server Error."});

    }

}