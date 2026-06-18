const mongoose = require("mongoose")

const requestSchema  = new mongoose.Schema({
    fromUserID:{
        type:mongoose.Types.ObjectId,
        ref:"userModel",
        require:true
    },
    toUserID:{
        type:mongoose.Types.ObjectId,
        ref:"userModel",
        require:true
    },
    status:{
        type:String,
        enum:{
            values:["ignored","interested","accepted","rejected"]
        }
    }
},{timestamps:true})


requestSchema.pre("save",function(next){
    connectionRequest = this
    if(connectionRequest.fromUserID.equals(connectionRequest.toUserID)){
        throw new Error("You can't Send to YourSelf")
    }
})
const RequestModal = mongoose.model("Request",requestSchema)

module.exports = RequestModal