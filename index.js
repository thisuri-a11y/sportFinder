import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import shopRoute from "./Route/shopRoute.js";
import productRoute from "./Route/productRoute.js";

const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_ORIGIN?.split(",") ?? true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8000;
const MONGOURL = process.env.MONGO_URL;

if (!MONGOURL) {
    console.error("Missing MONGO_URL in environment. Set it in a .env file.");
    process.exit(1);
}

app.use("/api/shop", shopRoute);
app.use("/api/product", productRoute);

app.use((req, res) => {
    res.status(404).json({ error: "Not found." });
});

mongoose
    .connect(MONGOURL)
    .then(() => {
        console.log("Database connected successfully.");
        app.listen(PORT, () => {
            console.log(`Server is running on port : ${PORT}`);
        });
    })
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
