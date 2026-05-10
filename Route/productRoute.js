import express from "express";

import {

    createProduct,
    fetchProducts,
    searchProducts,
    updateProduct,
    deleteProduct

} from "../Controller/productController.js";

const route = express.Router();

route.get("/getallproducts",fetchProducts);

route.get("/search",searchProducts);

route.post("/create",createProduct);

route.put("/update/:id",updateProduct);

route.delete("/delete/:id",deleteProduct);

export default route;