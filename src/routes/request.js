const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });

        const data = await connectionRequest.save();
        res.status(200).json({message: "Connection request sent successfully", data});
    } catch (err) {
        res.status(400).send("Some error occurred " + err.message);
    }
});

module.exports = requestRouter;