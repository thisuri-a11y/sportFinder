import express from "express";
import {
    createProduct,
    fetchProducts,
    searchProducts,
    updateProduct,
    deleteProduct,
} from "../Controller/productController.js";

const route = express.Router();

// Products
route.get("/getallproducts", fetchProducts);

// Support BOTH GET (query params) and POST (JSON body) for search
route.get("/search", searchProducts);
route.post("/search", searchProducts);

route.post("/create", createProduct);
route.put("/update/:id", updateProduct);
route.delete("/delete/:id", deleteProduct);

export default route;