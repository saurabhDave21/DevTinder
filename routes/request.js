const { isUserAuth } = require("../MiddleWare/UserAuth");
const express = require("express");
const { StatusVaild } = require("../utils/vaildate");
const RequestModal = require("../Model/ConnectionSchema");
const requestRouter = express.Router();
const userModal = require("../Model/userSchema");
const sendEmail = require("../utils/sendEmail");
requestRouter.post(
  "/request/send/:status/:toUserID",
  isUserAuth,
  async (req, res) => {
    try {
      //i want to check current user not send back same request and toUser not send back request
      const fromUserID = req.user._id;
      const toUserID = req.params.toUserID;
      const status = req.params.status;
      StatusVaild(status);
      const RequestExists = await RequestModal.findOne({
        $or: [
          { fromUserID, toUserID },
          { fromUserID: toUserID, toUserID: fromUserID },
        ],
      });
      if (RequestExists) {
        return res.status(404).json({ message: "Your Request has Exists" });
      }
      const toUserExists = await userModal.findById({ _id: toUserID });
      if (!toUserExists) {
        return res.status(400).json({ message: "Receviver not Found" });
      }
      const request = new RequestModal({
        fromUserID,
        toUserID,
        status,
      });
      const data = await request.save();
      // const response = await sendEmail.run("Your Sending Request", `${req.user.firstName} is ${status} to ${toUserExists.firstName}`);
      console.log(response);
      res.status(201).json({
        message: `${req.user.firstName} is ${status} to ${toUserExists.firstName}`,
        data,
      });
    } catch (err) {
      res.status(400).send("Something Went Wrong" + err.message);
    }
  },
);

requestRouter.post(
  "/request/review/:status/:ReqID",
  isUserAuth,
  async (req, res) => {
    try {
      const isLoginUser = req.user;
      const { ReqID, status } = req.params;

      const ALLOWED_STATUS = ["accepted", "rejected"];
      if (!ALLOWED_STATUS.includes(status)) {
        return res.status(400).json({ message: "Status is Incorrect" });
      }
      const isValidRequest = await RequestModal.findById(ReqID);

      if (!isValidRequest) {
        return res.status(404).json({
          message: "There is no request with this RequestID",
        });
      }

      const reqIdMatch = isValidRequest._id.toString() === ReqID.toString();

      const toUserIdMatch =
        isValidRequest.toUserID?.toString() === isLoginUser._id.toString();

      if (!reqIdMatch) {
        return res.status(404).json({
          message: `Invalid RequestID: ${ReqID}`,
        });
      }

      if (!toUserIdMatch) {
        return res.status(404).json({
          message: "User ID does not match",
        });
      }
      isValidRequest.status = status;
      const data = await isValidRequest.save();
      res.status(200).json({ message: "Connection is" + status, data });
    } catch (err) {
      res.status(400).json({ message: "Something Went Wrong" + err.message });
    }
  },
);
module.exports = requestRouter;
