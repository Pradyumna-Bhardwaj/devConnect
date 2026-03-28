const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const receivedRequests = await ConnectionRequest.find({
      toUserId: req.user._id,
      status: "interested",
    }).populate("fromUserId", "firstName lastName");
    res.status(200).json({ receivedRequests });
  } catch (err) {
    res.status(400).send("Some error occurred: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: req.user._id, status: "accepted" },
        { toUserId: req.user._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", "firstName lastName")
      .populate("toUserId", "firstName lastName");


    // Implementing if connection req. was sent by the logged in user then connection sould show toUserId else fromUserId data
    data = connections.map((connection) => {
      if (connection.fromUserId._id.equals(req.user._id)) {
        return connection.toUserId;
      } else {
        return connection.fromUserId;
      }
    });

    res.status(200).json({ data });
  } catch (err) {
    res.status(400).send("Some error occurred: " + err.message);
  }
});

module.exports = userRouter;
