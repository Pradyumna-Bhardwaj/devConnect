const express = require("express");
const authRouter = express.Router();
const { validateSignup } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

// signup
authRouter.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // Validate Data
  const error = validateSignup({ firstName, lastName, email, password });
  if (error) {
    return res.status(400).send(error);
  }

  // Create User
  const user = new User({
    firstName,
    lastName,
    email,
    password: await bcrypt.hash(password, 10),
  });
  try {
    await user.save();
    res.status(201).send(user);
  } catch (err) {
    console.log("Error saving user", err);
    res.status(500).send("Some error occurred - " + err.message);
  }
});

//login
authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send("Invalid email");
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(400).send("Invalid password");
  }

  // Generate Token if Password is correct
  if (isMatch) {
    const token = await user.getJWTToken();
    res.cookie("token", token);
  }

  res.status(200).send("Login successful");
});

//logout
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date.now() });
  res.status(200).send("Logout successful");
});

module.exports = authRouter;
