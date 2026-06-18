require("./DB/connectDB");
const express = require("express");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const app = express();


//order matters here if / only come fast then it makes create issue
//here also we can get next() parameter in if we have multiple routes then we can divide routes into second one

app.use(express.json()); //middleWare
app.use(cookieParser())

app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)
app.use("/",userRouter)


app.listen(7777, () => {
  console.log("Server is Start");
});
