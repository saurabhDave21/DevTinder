const { isUserAuth } = require("../MiddleWare/UserAuth");
const { isVaildUpdateData, isPasswordStrong } = require("../utils/vaildate");
const userModel = require("../Model/userSchema");
const express = require("express");
const bcrypt = require("bcrypt");
const profileRouter = express.Router();

profileRouter.get("/profile/view", isUserAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({message:"Data successfully fetch",data:user})
  } catch (err) {
    res.status(404).json({message:"Error"+err.message})
  }
});

profileRouter.patch("/profile/edit", isUserAuth, async (req, res) => {
  try {
    isVaildUpdateData(req);
    // Object.keys(isLoginUser).forEach((elm)=>isLoginUser[elm]=req.body[elm])
    const UpdateOrNot = await userModel.findByIdAndUpdate(
      req.user._id,
      req.body,
      { returnDocument: "after" },
    );
    res.send(UpdateOrNot);
  } catch (err) {
    res.status(400).send("Something Went Wrong" + err.message);
  }
});

profileRouter.patch("/profile/password", isUserAuth, async (req, res) => {
  try {
    if (!req.body.currentPassword || !req.body.newPassword) {
      return res.status(400).send("Passwords are required");
    }
    const user = req.user;
    const isCurrentPassVaild = await bcrypt.compare(
      req.body.currentPassword,
      user.password,
    );
    if (!isCurrentPassVaild) {
      return res.status(400).send("Current Password does not match");
    }
    isPasswordStrong(req);
    const samePassword = await bcrypt.compare(
      req.body.newPassword,
      user.password,
    );
    if (samePassword) {
      throw new Error("New Password Must be diffrent");
    }
    const hashNewPassword = await bcrypt.hash(req.body.newPassword, 10);
    user.password = hashNewPassword;
    await user.save();
    res.send("Password Change Successfully");
  } catch (err) {
    res.status(400).send("Something gone be Wrong" + err.message);
  }
});
module.exports = profileRouter;
