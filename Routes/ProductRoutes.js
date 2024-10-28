const { response } = require('express')
const ProductModel = require('../Model/ProductSchema')
const UserModel = require('../Model/UserSchema')
const router=require('express').Router()
//To get all the products in the home page
router.get('/',async (req,res)=>{
   try {
    const response = await ProductModel.find()
    res.status(200).json(response)
   } catch (error) {
    console.log(error)
   }
})
//To add the product to the specific users cart
router.post('/addtocart/:id',async (req,res)=>{
    try {
        const productId=req.params.id
        const productData=await ProductModel.findById(productId)
        const userId=req.body.userId
        const userData=await UserModel.findById(userId)
        const duplicate=userData.cart.find(e=>e.product==productId)
        if(duplicate){
            res.json({msg:"already added"})
        }
        else {
            userData.cart.push({
                product:productData._id,
                quantity:1
            })
           await userData.save()
           res.json({msg:"added to cart"})
        }
    }   catch (error) {
        console.log(error)
    }
})
//TO get cutomers cart data when he logins
router.get('/getcartdata/:id',async(req,res)=>{
    try {
        const userId=req.params.id
    const response=await UserModel.findById(userId).populate({
        path:"cart.product"
    }) 
    res.status(200).json(response)
    } catch (error) {
        console.log(error)
    }
})
//To increase the product quantity 
router.put('/incquantity/:id',async(req,res)=>{
    try {
     const productId=req.params.id;
     const userId=req.body.userId
     const user=await UserModel.findById(userId)
     const cartItem=user.cart.find(e=>e.product.toString()===productId)
     cartItem.quantity+=1;
     const response=await user.save();
     res.json(response)
    } catch (error) {
     console.log(error)
    }
 })
 //To dicrease the quantity of the product
 router.put('/decquantity/:id',async(req,res)=>{
     try {
         const productId=req.params.id;
     const userId=req.body.userId
     const userData=await UserModel.findById(userId)
     const cartproduct=userData.cart.find(e=>e.product.toString()===productId)
     const index=userData.cart.find(e=>e.product.toString()===productId)
     if(cartproduct.quantity>1)
     {
         cartproduct.quantity--;
     }
     else{
         userData.cart.splice(index,1)
     }
     const response=await userData.save();
     res.json(response)
     res.json()
     } catch (error) {
         console.log(error)
     }
 })
 //To remove the product from cart
 router.put('/removecart/:id',async(req,res)=>{
    try {
     const productId=req.params.id;
     const userId=req.body.userId
     const userData=await UserModel.findById(userId)
     const index=userData.cart.find(e=>e.product.toString()===productId)
     userData.cart.splice(index,1)
     const response=await userData.save();
     res.json(response)
    } catch (error) {
     console.log(error)
    }
 })
module.exports=router