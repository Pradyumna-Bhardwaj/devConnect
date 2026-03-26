const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address : "+ value);
            }
        }
    },
    password:{
        type:String,
        required:true,
    },
    age:{
        type:Number,
    },
    gender:{
        type:String,
        validate(value){
            if(!["male", "female", "other"].includes(value)){
                throw new Error("Invalid gender");
            }
        },

    },
    phtotoUrl:{
        type:String,
        default: "https://placehold.co/200x200/png?text=User",
    },
    about:{
        type:String,
        about: "I am a default about",
    },
    skills:{
        type:[String],
    },
},{
    timestamps:true,
});


userSchema.methods.getJWTToken = async function(){
    const token = await jwt.sign({_id: this._id}, "devConnect@504");
    return token;
}

userSchema.methods.comparePassword = async function(userPassword){
    return await bcrypt.compare(userPassword, this.password);
}

const User = mongoose.model("User", userSchema);

module.exports = User;