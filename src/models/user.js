const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema({
    firstName: {
        type:String,
        required: true,
    },
    lastName: {
        type:String,
    },
    emailId: {
        type:String, 
        lowercase:true,
        required: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email Address");
            }
        }
        
    },
    password: {
        type: String,
        required: true,
    },
    age:{
        type: Number,
        min: 18,
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender is not valid");
            }
        }
    },
    about:{
        type:String,
        default:"Hey I am software engineer",
    },
    skills:{
        type:[String]
    }
},{timestamps:true});

module.exports = mongoose.model("User", userSchema);