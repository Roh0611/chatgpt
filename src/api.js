const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const serverless = require("serverless-http");
const router = express.Router();

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        brand: { type: String, required: true },
        desc: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: Object, required: true },
    },
    { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

router.get("/products", async (req, res) => {
    const qbrand = req.query.brand;
    try {
        let products;

        if (qbrand) {
            products = await Product.find({
                brand: qbrand,
            });
        } else {
            products = await Product.find();
        }

        res.status(200).send(products);
    } catch (error) {
        res.status(500).send(error);
    }
});

const app = express();
require("dotenv").config();
router.use(cors());
router.use(bodyParser.json({ limit: '10mb' }));
router.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

router.get("/", (req, res) => {
    res.json({
        hello: "hi!"
    });
});
mongoose
    .connect("mongodb+srv://avalanche:Marvel%40mongodb312@avalanche.w7pqovq.mongodb.net/?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectTimeoutMS: 30000 // set the connectTimeoutMS option to 30 seconds
    })
    .then(() => console.log("MongoDB connection established..."))
    .catch((error) => console.error("MongoDB connection failed:", error.message));

app.use(`/.netlify/functions/api`, router);
module.exports = app;
module.exports.handler = serverless(app);