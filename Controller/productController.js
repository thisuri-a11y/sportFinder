import mongoose from "mongoose";
import Product from "../Model/productModel.js";
import Shop from "../Model/shopModel.js";

function escapeRegex(str) {
    return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function sendError(res, error) {
    if (error?.name === "ValidationError") {
        return res.status(400).json({ error: error.message });
    }
    if (error?.name === "CastError") {
        return res.status(400).json({ error: "Invalid id format." });
    }
    return res.status(500).json({ error: "Internal Server Error." });
}

// CREATE PRODUCT
export const createProduct = async (req, res) => {
    try {
        const { shopId } = req.body;
        if (!shopId) {
            return res.status(400).json({ error: "shopId is required." });
        }
        if (!mongoose.isValidObjectId(shopId)) {
            return res.status(400).json({
                error: "shopId must be a valid MongoDB ObjectId (24 hex characters from an existing shop).",
            });
        }
        const shop = await Shop.findById(shopId);
        if (!shop) {
            return res.status(400).json({ error: "No shop exists with this shopId." });
        }

        const productData = new Product(req.body);
        const savedProduct = await productData.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        return sendError(res, error);
    }
};

// GET ALL PRODUCTS
export const fetchProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("shopId");
        res.status(200).json(products);
    } catch (error) {
        return sendError(res, error);
    }
};

// SEARCH PRODUCTS BY DISTRICT (query string and/or JSON body; productName or legacy "product")
export const searchProducts = async (req, res) => {
    try {
        const input = { ...req.query, ...req.body };
        const districtRaw = input.district;
        const nameRaw = input.productName ?? input.product;

        const district = typeof districtRaw === "string" ? districtRaw.trim() : "";
        const productName = typeof nameRaw === "string" ? nameRaw.trim() : "";

        if (!district) {
            return res.status(400).json({ error: "district is required." });
        }

        // Substring match so e.g. "Colombo" matches "Colombo District" in DB
        const shops = await Shop.find({
            district: { $regex: new RegExp(escapeRegex(district), "i") },
        });

        const shopIds = shops
            .map((shop) => shop._id ?? shop.id)
            .filter((id) => id != null && mongoose.isValidObjectId(String(id)));
        if (shopIds.length === 0) {
            return res.status(200).json([]);
        }

        const filter = { shopId: { $in: shopIds } };
        if (productName) {
            filter.productName = {
                $regex: escapeRegex(productName),
                $options: "i",
            };
        }

        const products = await Product.find(filter).populate("shopId");
        res.status(200).json(products);
    } catch (error) {
        return sendError(res, error);
    }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ error: "Invalid id format." });
        }

        const productExist = await Product.findOne({ _id: id });
        if (!productExist) {
            return res.status(404).json({ message: "Product not found." });
        }

        const { shopId: bodyShopId } = req.body;
        if (bodyShopId !== undefined) {
            if (!mongoose.isValidObjectId(bodyShopId)) {
                return res.status(400).json({ error: "Invalid id format." });
            }
            const shop = await Shop.findById(bodyShopId);
            if (!shop) {
                return res.status(400).json({ error: "No shop exists with this shopId." });
            }
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(200).json(updatedProduct);
    } catch (error) {
        return sendError(res, error);
    }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ error: "Invalid id format." });
        }

        const productExist = await Product.findOne({ _id: id });
        if (!productExist) {
            return res.status(404).json({ message: "Product not found." });
        }

        await Product.findByIdAndDelete(id);
        res.status(200).json({ message: "Product deleted successfully." });
    } catch (error) {
        return sendError(res, error);
    }
};
