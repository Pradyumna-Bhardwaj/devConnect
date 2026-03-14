const adminAuth = (req, res, next) => {
    const token = "xyze"

    isAdminAuth = token === "xyz"

    if(isAdminAuth){
        next();
    }else{
        res.status(401).send("Unauthorized");
    }
}

module.exports = { adminAuth }