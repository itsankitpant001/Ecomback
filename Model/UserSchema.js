const mongoose = require('mongoose');
// Define Cart Item Schema
const CartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1, // Default quantity is 1 when added to the cart
    }
});
// Define User Schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    cart: [CartItemSchema] // Use the CartItemSchema to store products with quantity
});

// Create and export the User model
const UserModel=mongoose.model("Users",UserSchema)
module.exports=UserModel