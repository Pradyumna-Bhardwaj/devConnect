const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateUpdateProfile } = require("../utils/validation");

const profileRouter = express.Router();


// get profile
profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
      const user = req.user;
      res.status(200).send(user);
    } catch (err) {
      res.status(400).send("Some error occurred " + err.message);
    }
  });

// update profile
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    const user = req.user;
    try{
        const isValidUpdate = validateUpdateProfile(req.body);
        if(!isValidUpdate){
            throw new Error("Invalid updates");
        }
        else{
            Object.keys(req.body).forEach(key => user[key]=req.body[key]);
            await user.save();
            return res.status(200).json({message: "Profile updated successfully", user});
        }
    }
    catch(error){
        return res.status(400).send("Some error occurred: " + error.message);
    }
});

module.exports = profileRouter ;