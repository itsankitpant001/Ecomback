const express=require('express');
const router=express.Router();
const razerpay=require('razorpay')
const dotenv=require('dotenv')
const crypto=require('crypto');
const paymentModel = require('../Model/PaymentSchema');
const UserModel = require('../Model/UserSchema');
dotenv.config()


const razerpayInstance=new razerpay({
    key_id:process.env.RZORPAY_KEY_ID,
    key_secret:process.env.RAZERPAY_SECRET_KEY
})
//To clear cart When payment is done
router.post('/clear',async (req,res)=>{
    try {
        const userId=req.body.userId
        console.log(userId)
    const user=await UserModel.findById(userId)
    console.log(userId)
      user.cart=[];
      await user.save();
      res.status(200).json({msg:'cart is clear'})
    } catch (error) {
        console.log(error)
    }
})
//Api to make order with razerpay
router.post('/order',(req,res)=>{
     const {amount}=req.body
      try {
        const options={
            amount:Number(amount*100),
            currency:"INR",
            receipt:crypto.randomBytes(10).toString("hex")
        }
        razerpayInstance.orders.create(options,(err,order)=>{
            if(err){
                console.log(err)
                return res.status(500).json({msg:"Something went wrong"})
            }
            if(order){
                console.log(order)
                return res.status(200).json({data:order})
            }
        })
      } catch (error) {
        
      }
})
//To veryfy the payment by veryfying signature send by razerpay 
router.post('/verify', async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, products,userId } = req.body;

    try {
        // Create Sign
        const sign = razorpay_order_id + "|" + razorpay_payment_id;

        // Create ExpectedSign
        const expectedSign = crypto.createHmac("sha256", process.env.RAZERPAY_SECRET_KEY)
            .update(sign)
            .digest("hex");

        // Create isAuthentic
        const isAuthentic = expectedSign === razorpay_signature;

        // Condition 
        if (isAuthentic) {
            const payment = new paymentModel({
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                amount: amount / 100, // Store amount in rupees
                products, // Store the products with names and quantities
                userId,
                
            });
            // Save Payment 
            await payment.save();
            // Send Message 
            res.json({
                msg: "Payment Successfully",
                paymentdata:{ razorpay_payment_id, amount: amount / 100, products }
            });
        } else {
            res.status(400).json({ message: "Payment verification failed!" });
        }
    } catch (error) {
        console.error("Error during payment verification:", error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
});


//To get all the payments/orders for admin
router.get("/allpayments",async(req,res)=>{
    try {
        const AllPayments=await paymentModel.find();
    res.status(200).json(AllPayments)
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;
module.exports=router; 