const { default: mongoose } = require("mongoose");
let validator = require('validator');
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const userSchema  = new mongoose.Schema({
    firstName:{
        type:String,
        required:true   
    },
    lastName:{
        type:String,
        required:true
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Not Vaild Email"+value)
            }
        }
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Password Must be Strong"+value)
            }
        }
    },
    age:{
        type:Number,
        required:true,
        validate(value){
            if(value>99){
                throw new Error("Age is Limit")
            }
        }
    },
    gender:{
        type:String,
        validate(value){
            if(!["Male","female","Others"].includes(value)){
                throw new Error("Not a Vaild Gender");   
            }
        }
    },
    about:{
        type:String,
        default:"Here for Myself"
    },
    photoURL:{
        type:String,
        require:true,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Enter a vaild URL")
            }
        }
    },
    skils:{
        type:[String],
        validate(value) {
        if (value.length > 5) {
            throw new Error("You can add maximum 5 skills");
        }
    }
    }
},
{
    timestamps:true
})
userSchema.methods.getJWT = function (){
    const user = this
    const token = jwt.sign({_id:user._id},process.env.JWT_KEY)
    return token
} 

userSchema.methods.vaildPassword = async function (UserByPassword){
    const user = this
    const hashPassword = user.password
    const isPasswordVaild = await bcrypt.compare(UserByPassword,hashPassword)
    return isPasswordVaild
}
const userModel = mongoose.model("userModel",userSchema)
module.exports = userModel