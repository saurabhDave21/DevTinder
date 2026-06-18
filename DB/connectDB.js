const { mongoose } = require("mongoose")

const url = "mongodb+srv://SD:XxRcwOTz84dufD09@backendpart.kjxcowp.mongodb.net/DevTinder"

const connectDB = async () =>{
    const res = await mongoose.connect(url)
    console.log("Successfully Connect to DB")
}

connectDB()
module.exports = connectDB