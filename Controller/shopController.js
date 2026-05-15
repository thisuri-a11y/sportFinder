import mongoose from "mongoose";
import Shop from "../Model/shopModel.js";
import Product from "../Model/productModel.js";

function sendError(res, error) {
    if (error?.name === "ValidationError") {
        return res.status(400).json({ error: error.message });
    }
    if (error?.name === "CastError") {
        return res.status(400).json({ error: "Invalid id format." });
    }
    return res.status(500).json({ error: "Internal Server Error." });
}

// CREATE SHOP
export const createShop = async (req, res) => {
    try {
        const shopData = new Shop(req.body);
        const savedShop = await shopData.save();
        res.status(201).json(savedShop);
    } catch (error) {
        return sendError(res, error);
    }
};

// GET ALL SHOPS
export const fetchShops = async (req, res) => {
    try {
        const shops = await Shop.find();
        res.status(200).json(shops);
    } catch (error) {
        return sendError(res, error);
    }
};

// UPDATE SHOP
export const updateShop = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ error: "Invalid id format." });
        }

        const shopExist = await Shop.findOne({ _id: id });
        if (!shopExist) {
            return res.status(404).json({ message: "Shop not found." });
        }

        const updatedShop = await Shop.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(200).json(updatedShop);
    } catch (error) {
        return sendError(res, error);
    }
};

// DELETE SHOP
export const deleteShop = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ error: "Invalid id format." });
        }

        const shopExist = await Shop.findOne({ _id: id });
        if (!shopExist) {
            return res.status(404).json({ message: "Shop not found." });
        }

        await Product.deleteMany({ shopId: id });
        await Shop.findByIdAndDelete(id);
        res.status(200).json({ message: "Shop deleted successfully." });
    } catch (error) {
        return sendError(res, error);
    }
};
