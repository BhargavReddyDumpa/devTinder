const express = require("express");
const {userAuth} = require("../middlewares/auth");
// cookie-parser middleware is applied globally in app.js

const profileRouter = express.Router();

profileRouter.get("/profile",userAuth, async (req,res)=>{
    try{
        const user = req.user;
        res.send(user);
    }catch(err){
        res.status(400).send("Error:"+ err.message);
    }
})

module.exports = profileRouter;