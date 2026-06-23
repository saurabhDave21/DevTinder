require('dotenv').config()
require("./DB/connectDB");
// require("./utils/cornJobs");
const express = require("express");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const cors = require("cors")
const app = express();


//order matters here if / only come fast then it makes create issue
//here also we can get next() parameter in if we have multiple routes then we can divide routes into second one

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.json()); //middleWare
app.use(cookieParser())

app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)
app.use("/",userRouter)


app.listen(process.env.PORT, () => {
  console.log("Server is Start");
});
