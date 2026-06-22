const express = require("express");
const { isUserAuth } = require("../MiddleWare/UserAuth");
const RequestModal = require("../Model/ConnectionSchema");
const userModal = require("../Model/userSchema");
const userRouter = express.Router();
const ALLOW_PUBLIC_DATA = [
  "firstName",
  "lastName",
  "age",
  "gender",
  "skils",
  "about",
  "photoURL"
];
userRouter.get("/user/request/received", isUserAuth, async (req, res) => {
  try {
    const isLoginUser = req.user;

    const requests = await RequestModal.find({
      toUserID: isLoginUser._id,
      status: "interested",
    }).populate("fromUserID", ALLOW_PUBLIC_DATA);

    res.status(200).json({ message: "Successfully fetch", requests });
  } catch (err) {
    res.status(404).json({ message: "Something Went Wrong" + err.message });
  }
});

userRouter.get("/user/request/connection", isUserAuth, async (req, res) => {
  try {
    const isLoginUser = req.user;

    const connection = await RequestModal.find({
      $or: [
        { toUserID: isLoginUser._id, status: "accepted" },
        { fromUserID: isLoginUser._id, status: "accepted" },
      ],
    })
      .populate("toUserID", ALLOW_PUBLIC_DATA)
      .populate("fromUserID", ALLOW_PUBLIC_DATA);

    const data = connection.map((elm) => {
      if (elm.fromUserID._id.toString() === isLoginUser._id.toString()) {
        return elm.toUserID;
      }
      return elm.fromUserID;
    });
    res.status(200).json({ message: "Here is Data", data });
  } catch (err) {
    res.status(404).json({ message: "Something Went Wrong" + err.message });
  }
});

userRouter.get("/feed", isUserAuth, async (req, res) => {
  try {
    const isLoginUser = req.user;
    const page = (req.query.page)||1;
    let limit = (req.query.limit) || 10;
    const skip = (page-1)*limit
    limit = limit > 50 ? 50 : limit
    // const requestAlredySent = await RequestModal.find({
    //   fromUserID: isLoginUser._id,
    // }).select("toUserID");
    // const allSendRequest = requestAlredySent.map((e) => e.toUserID);
    // const users = await userModal.find({
    //   $nor:[
    //     {_id:isLoginUser._id},
    //     {_id:{$in:allSendRequest}}
    //   ]
    // });
    const requestAlredyExists = await RequestModal.find({
      $or: [{ fromUserID: isLoginUser._id }, { toUserID: isLoginUser._id }],
    })
      .select("toUserID")
      .select("fromUserID")
    const hasRequest = new Set();
    requestAlredyExists.forEach((e) => {
      hasRequest.add(e.toUserID._id.toString()),
      hasRequest.add(e.fromUserID._id.toString())
    });
    const users = await userModal.find({
      $and:[
        {_id:{$nin:Array.from(hasRequest)}},
        {_id:{$ne:isLoginUser._id}}
      ]
    }).skip(skip).limit(limit)
    res.status(200).json({ message: "Data fetch", users });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
module.exports = userRouter;
