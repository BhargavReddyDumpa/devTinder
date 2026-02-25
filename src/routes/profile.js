const express = require("express");
const {userAuth} = require("../middlewares/auth");
const {validateEditProfiledata, validateExistingPassword} = require("../utils/validation")
const bcrypt = require("bcrypt")
const User = require("../models/user.js")

// cookie-parser middleware is applied globally in app.js

const profileRouter = express.Router();

profileRouter.get("/profile/view",userAuth, async (req,res)=>{
    try{
        const user = req.user;
        res.send(user);
    }catch(err){
        res.status(400).send("Error:"+ err.message);
    }
})

profileRouter.patch("/profile/edit", userAuth, async (req,res)=>{
    try{
        if(!validateEditProfiledata(req)){
            throw new Error("Cannot edit these field");
        }
        const loggedinUser = req.user;
        Object.keys(req.body).forEach((key)=>(loggedinUser[key]=req.body[key]));

        await loggedinUser.save();
        res.json({
            message:`${loggedinUser.firstName}, Your profile updated successfully`,
            data: loggedinUser,
        })
    }catch(err){
        res.status(400).send("Cannot update the user: "+err.message);
    }
})

profileRouter.patch("/profile/updatepassword", userAuth, async(req,res)=>{
    // const storedHashpassword = req.user.password;
    try{
    if(!validateExistingPassword(req)){
        throw new Error("Please enter emailId, password, newpassword");
    }
    const loggedinUser = req.user;
    const user = await User.findOne({emailId:req.body.emailId});
    const passwordHash = await user.validatepassword(req.body.password);
    if(passwordHash){
    const newPassword = await bcrypt.hash(req.body.newPassword,10);
    loggedinUser["password"] = newPassword;
    await loggedinUser.save();
    res.json({
        message:`${loggedinUser.firstName}, Your passward is updated successfully`
    })}else{
        throw new Error("Invalid password");
    } 
    } catch(err){
        res.status(400).send("Something went wrong "+err.message);
    }

})



module.exports = profileRouter;