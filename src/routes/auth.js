const express = require("express");
const { validateSignUpData } = require("../utils/validation.js");
const authRouter = express.Router();
const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const {userAuth} = require("../middlewares/auth");


authRouter.post("/signup", async (req, res)=>{
    //validation of data
    try{
        validateSignUpData(req)
        //encrypt the password
        const {firstName, lastName, emailId, password,gender,about,skills} = req.body;
        const passwordHash = await bcrypt.hash(password,10);
        console.log(passwordHash);
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
            gender,
            about,
            skills
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
            res.cookie("token",token, {
                expires:new Date(Date.now() + 8 * 360000), // 8 hours
            });
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
    //res.clearCookie('cookieName');
    // res.clearCookie("token");
    res.cookie("token",null,{
        expires: new Date(Date.now()),
    })
    res.send("Logged out successfully");
})



module.exports = authRouter;