const ProductModel = require('../Model/ProductSchema');

const router=require('express').Router()

// API to Post Product Info
router.post('/product', async (req, res) => {
    const { name, title, description, category, imageUrl , price } = req.body;
    // Validate if all required fields are provided
    if (!name || !description || !category || !imageUrl || !price) {
        return res.status(400).json({ message: "All fields are required" });
    }
    // Create a new product object with the imageUrl
    const newProduct = new ProductModel({
        name,
        description,
        category,
        imageUrl,
        price
    });

    try {
        // Save product to database
        await newProduct.save();
        res.status(201).json({ message: "Product added successfully", product: newProduct });
    } catch (err) {
        res.status(500).json({ error: "Error adding product" });
    }
});
module.exports=router
