const express = require("express");
const { adminAuth } = require("./middlewares/auth");
const { connectDB } = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());

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
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).send(user);
  } catch (err) {
    console.log("Error saving user", err);
    res.status(500).send("Some error occurred - " + err.message);
  }
});

app.patch("/user/:userId", async (req, res) => {
  userId = req.params.userId;
  data = req.body;

  try {
    // API LVL VALIDATIONS
    ALLOWED_UPDATES = [
      "age",
      "gender",
      "phtotoUrl",
      "about",
      "skills",
    ];
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
