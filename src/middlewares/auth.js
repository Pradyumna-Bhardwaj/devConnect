const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  //read the cookie
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid token, login again");
    }

    const decoded = await jwt.verify(token, "devConnect@504");
    if (!decoded) {
      throw new Error("Invalid token, login again");
    }

    //find the user
    const user = await User.findById(decoded._id);
    if (!user) {
      throw new Error("User not found");
    }
    
    req.user = user;
    next();
  } catch (err) {
    return res.status(400).send("Some error occurred: " + err.message);
  }
};

module.exports = { userAuth };
