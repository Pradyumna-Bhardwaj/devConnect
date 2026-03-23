const validator = require("validator");

const validateSignup = (userData) => {
    try{
    const {firstName, lastName, email, password} = userData;
    if(!firstName || !lastName || !email || !password){
        throw new Error("All fields are not filled");
    }
    if(!validator.isEmail(email)){
        throw new Error("Invalid email address : "+ email);
    }
    if(password.length < 8){
        throw new Error("Password must be at least 8 characters long");
    }

    }catch(error){
        return error.message;
    }
}

module.exports = { validateSignup };