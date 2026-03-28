const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const { isEAN } = require("validator");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      //validating status
      if (!["interested", "ignored"].includes(status)) {
        throw new Error("Invalid status: " + status);
      }

      //validating logged in user and to user id
      if(fromUserId.equals(toUserId)){
        throw new Error("You cannot send a connection request to yourself");
      }

      //checking if connection already exists
      isExitingConnection = await ConnectionRequest.findOne({$or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId }
      ]});

      if(isExitingConnection){
        throw new Error("Connection already exists");
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      res
        .status(200)
        .json({ message: "Connection request sent successfully", data });
    } catch (err) {
      res.status(400).send("Some error occurred: " + err.message);
    }
  },
);

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) =>{
    try{
        const requestId = req.params.requestId;
        const status = req.params.status;

        //validating status
        if(!["accepted", "rejected"].includes(status)){
            throw new Error("Invalid status: " + status);
        }

        //validating logged in user and request Id
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: req.user._id,
            status: "interested",
        });

        if(!connectionRequest){
            throw new Error("Connection request not found");
        }

        connectionRequest.status = status;
        data =await connectionRequest.save();
        res.status(200).json({ message: "Connection request " + status, data });
    }
    catch(err){
        res.status(400).send("Some error occurred: " + err.message);
    }
})

module.exports = requestRouter;
