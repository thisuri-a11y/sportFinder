import express from "express";

import {

    createShop,
    fetchShops,
    updateShop,
    deleteShop

} from "../Controller/shopController.js";

const route = express.Router();

route.get("/getallshops",fetchShops);

route.post("/create",createShop);

route.put("/update/:id",updateShop);

route.delete("/delete/:id",deleteShop);

export default route;