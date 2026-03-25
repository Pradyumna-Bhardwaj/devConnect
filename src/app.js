const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const { userAuth } = require("./middlewares/auth");
const { connectDB } = require("./config/database");
const { validateSignup } = require("./utils/validation");

const User = require("./models/user");

const app = express();

app.use(express.json());
app.use(cookieParser());
// get user by email
app.get("/user", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    res.status(200).send(user);
  } catch (err) {
    console.log("Error fetching user", err);
    res.status(500).send("Some error occurred");
  }
});

// get all users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (err) {
    console.log("Error fetching users", err);
    res.status(500).send("Some error occurred");
  }
});

// signup
app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send("Invalid email");
  }
  const isMatch = await bcrypt.compare(password, user.password);
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

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send("Some error occurred " + err.message);
  }
});

app.patch("/user/:userId", async (req, res) => {
  userId = req.params.userId;
  data = req.body;

  try {
    // API LVL VALIDATIONS
    ALLOWED_UPDATES = ["age", "gender", "phtotoUrl", "about", "skills"];
    isUpdateAllowed = Object.keys(data).every((update) =>
      ALLOWED_UPDATES.includes(update),
    );
    if (!isUpdateAllowed) {
      throw new Error("Invalid updates");
    }

    await User.findByIdAndUpdate(userId, req.body, {
      returnDocument: "after",
      runValidators: true,
    });
    res.status(200).send("User updated successfully");
  } catch (err) {
    console.log("Error updating user", err);
    res.status(500).send("Some error occurred - " + err.message);
  }
});

// delete user
app.delete("/user", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.body.id);
    res.status(200).send("User deleted successfully");
  } catch (err) {
    console.log("Error deleting user", err);
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
