const jwt=require('jsonwebtoken')

const veryfyToken=(req,res,next)=>{
    const token=req.body.token
    if(token){
        const response=jwt.verify(token,"secret",(err)=>{
            if(err){
            console.log(err)
            res.status(403).json({msg:"kuch error hai token me"})
            }
            next()
        })
       
    }
    else{
        res.status(404).json({msg:"token not found"})
    }
    
}
module.exports=veryfyToken