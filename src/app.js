const express = require("express");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./config/database");

const app = express();
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const cors = require("cors");

//TESTING GIT PUSH COMMENT
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "",
  credentials: true,
}));
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });
