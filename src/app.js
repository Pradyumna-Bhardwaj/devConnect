const express = require("express");
const { adminAuth } = require("./middlewares/auth");
const { connectDB } = require("./config/database");
const User = require("./models/user");

const app = express();

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Pradyumna",
    lastName: "Bhardwaj",
    email: "pradyumna05@gmail.com",
    age: 25,
    gender: "Male",
  });
  try {
    await user.save();
    res.status(201).send(user);
  } catch (err) {
    console.log("Error saving user", err);
    res.status(500).send("Some error occurred");
  }
});

connectDB()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });
