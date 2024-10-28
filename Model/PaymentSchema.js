const mongoose = require('mongoose');

// Define a schema for the product details
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // Ensure the product title is always provided
    },
    quantity: {
        type: Number,
        required: true, // Ensure the quantity is always provided
    },
});



// Define the main payment schema
const paymentSchema = new mongoose.Schema({
    razorpay_order_id: {
        type: String,
        required: true,
    },
    razorpay_payment_id: {
        type: String,
        required: true,
    },
    razorpay_signature: {
        type: String,
        required: true,
    },
    amount: {
        type: Number, // Amount paid
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    products: [productSchema], // Array of products containing names and quantities
    userId: { // Field for storing the user ID
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        required: true, // Set to true to ensure it is always provided
        ref: 'User', // Reference to the User collection
    },
    
    deleverd:{
        type:Boolean,
        default:false
    }
});

// Create the payment model
const paymentModel = mongoose.model('Payments', paymentSchema);
module.exports = paymentModel;
