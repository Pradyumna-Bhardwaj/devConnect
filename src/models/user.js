const mongoose = require("mongoose");

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

const User = mongoose.model("User", userSchema);

module.exports = User;