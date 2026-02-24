const express = require("express");
const { validateSignUpData } = require("../utils/validation.js");
const authRouter = express.Router();
const User = require("../models/user.js");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res)=>{
    //validation of data
    try{
        validateSignUpData(req)
        //encrypt the password
        const {firstName, lastName, emailId, password} = req.body;
        const passwordHash = await bcrypt.hash(password,10);
        console.log(passwordHash);
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });
            await user.save();
            res.send("User saved successfully");
    }
    catch (err){
        res.status(400).send("error saving the user:" + err.message);
    }
})


authRouter.post("/login", async(req,res)=>{ 
    try{
        const {emailId, password} = req.body;
        const user = await User.findOne({emailId:emailId});
        if(!user){
            throw new Error("Invalid Credentials");
        }
        const passwordHash = await user.validatepassword(password);
        if(passwordHash){
            const token = await user.getjwt();
            res.cookie("token",token);
            res.send("Login Successfull");
        }
        else{
            throw new Error("Invalid Credentails");
        }
    }
    catch(err){
        res.status(400).send("Cannot Login user"+err.message);
    }
});

authRouter.post("/logout", async(req,res)=>{
    
})



module.exports = authRouter;