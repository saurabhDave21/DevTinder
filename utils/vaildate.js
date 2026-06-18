let validator = require('validator');
const isVaildUpdateData = (req) =>{
    const ALLOW_FIELD = ["firstName","lastName","age","gender","skils","about","photoURL"]

    const UpdateAllow = Object.keys(req.body).every(k=>ALLOW_FIELD.includes(k))
    if(!UpdateAllow){
        throw new Error(" Invaild Update ")
    }
}

const isPasswordStrong  = (req)=>{
    if(!validator.isStrongPassword(req.body.newPassword)){
        throw new Error("Enter a Strong New Password")
    }
}

const StatusVaild = (status)=>{
    const Allow_Status = ["ignored","interested"]
    if(!Allow_Status.includes(status)){
        throw new Error("Not a Vaild Status")
    }
    
}
module.exports = {isVaildUpdateData,isPasswordStrong,StatusVaild}