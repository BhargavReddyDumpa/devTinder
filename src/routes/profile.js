const express = require("express");
const {userAuth} = require("../middlewares/auth");
const {validateEditProfiledata} = require("../utils/validation")

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



module.exports = profileRouter;