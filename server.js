const mongoose =require('mongoose')
const express=require('express')
const app=express();
require('dotenv').config()
app.use(express.json())
const cors=require('cors')
app.use(cors())
const UserRoute=require('./Routes/UserRoute')
const ProductRoute=require('./Routes/ProductRoutes')
const AdminRoute=require('./Routes/AdminRoute')
const PaymentRoute=require('./Routes/PaymentRoute')

mongoose.connect(process.env.URL).then(()=>{
    console.log("Mongo Db is connected")
}).catch((err)=>{
    console.log(err)
})
app.listen(process.env.PORT || 8000,()=>{
    console.log(`Port is connected on ${process.env.PORT}`)
})
app.use(UserRoute)
app.use(AdminRoute)
app.use(ProductRoute)
app.use(PaymentRoute)

