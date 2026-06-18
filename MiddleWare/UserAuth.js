const jwt = require("jsonwebtoken")
const userModel = require("../Model/userSchema");
const isUserAuth = async (req,res,next)=>{
   try{
   const {token} = req.cookies
   if(!token){
    throw new Error("Token Invaild")
   }
   const {_id} = await jwt.verify(token,"Saurabh21")
   const user = await userModel.findById(_id)
   if(!user){
    throw new Error("User not exist")
   }
   req.user = user
   next()
   }
   catch(err){
    res.status(400).send(" Error "+ err.message)
   }

}
module.exports = {isUserAuth}