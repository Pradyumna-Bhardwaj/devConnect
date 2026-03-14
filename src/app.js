const express = require("express");
const { adminAuth } = require("./middlewares/auth");

const app = express();

app.use("/admin", adminAuth)

app.use("/admin/hello",(req, res,next)=>{
    console.log("hello middleware 1");
    next();
},
(req,res,next)=>{
    console.log("hello middleware 2");
    res.send("hello middleware 2");
})




app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

