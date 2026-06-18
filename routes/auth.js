const express = require("express")
const userModel = require("../Model/userSchema");
const authRouter = express.Router()
const bcrypt = require("bcrypt")
authRouter.post("/signup", async (req, res) => {
  try {
    const {firstName,lastName,emailId,password,age,gender,about,photoURL,skils} = req.body
    const HashPassword =await bcrypt.hash(password,10)
    const userExists = await userModel.findOne({emailId})
    if(userExists){
        return res.status(400).send("User Already exists with Email")
    }
    const user = new userModel({
        firstName,
        lastName,
        emailId,
        age,
        gender,
        about,
        photoURL,
        skils,
        password:HashPassword
    });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

authRouter.post("/login",async (req,res)=>{
    const {email,password} = req.body
    try{
        const user = await userModel.findOne({emailId:email})
        if(!user){
            throw new Error("Email not Found")
        }
        const isPassword =await user.vaildPassword(password)
        if(!isPassword){
            throw new Error("Password is Not Vaild")
        }
        else{
            const token = user.getJWT()
            res.cookie("token",token)
            res.send("Login Successfully")
        }
    }
    catch(err){
        res.status(401).send("Something Wrong  :" + err.message)
    }
})

authRouter.get("/logout",async (req,res)=>{
  res.clearCookie("token")
  res.send("Logout Successfully")
})

module.exports = authRouter