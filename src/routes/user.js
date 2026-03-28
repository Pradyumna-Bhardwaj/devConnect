const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

// get all connection requests received by the logged in user
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

// get all connections of the logged in user
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

//get feed for the logged in user
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    limit > 50 ? (limit = 50) : limit;
    const skip = (page - 1) * limit;
    //TODO: find all requests linked with logged in user.
    const userRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: req.user._id }, { toUserId: req.user._id }],
    });
    //TODO: make a set of the user ids
    const hiddenUsersIds = new Set();
    userRequests.forEach((req) => {
      hiddenUsersIds.add(req.fromUserId);
      hiddenUsersIds.add(req.toUserId);
    });
    //TODO: make a user ids set excluding the above ids.
    const feedUsers = await User.find({
      _id: { $nin: Array.from(hiddenUsersIds) },
    })
      .select("firstName lastName phtotoUrl skills")
      .skip(skip)
      .limit(limit);

    res.status(200).json({ feedUsers });
  } catch (err) {
    res.status(400).send("Some error occurred: " + err.message);
  }
});

module.exports = userRouter;
