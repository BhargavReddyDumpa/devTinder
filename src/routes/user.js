const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const USER_SAFE_DATA = "firstName lastName age gender about skills"


userRouter.get("/user/requests/received" ,userAuth, async(req,res)=>{
    try{
        const loggedinuser = req.user;

        const connectionrequest = await ConnectionRequest.find({
            toUserId:loggedinuser._id,
            status:"interested"
        }).populate("fromUserId", "firstName lastName age gender about skills");

        console.log(connectionrequest)
        res.json({
            message:"Data feteched successfully",
            data:connectionrequest
        })

    }catch(err){
        res.status(400).send("ERROR " + err.message);
    }
})

userRouter.get("/user/requests/connections", userAuth, async(req,res)=>{
    try {
        const loggedinuser = req.user;
        const connectionsRequests = await ConnectionRequest.find({
            $or:[
                {toUserId:loggedinuser._id, status:"accepted"},
                {fromUserId:loggedinuser._id, status:"accepted"}
            ]
        }).populate("fromUserId",USER_SAFE_DATA).
        populate("toUserId",USER_SAFE_DATA);
        console.log(connectionsRequests);

        const data = connectionsRequests.map((row) =>{
            if(row.fromUserId._id.equals(loggedinuser._id)){
                return row.toUserId;
            }
            return row.fromUserId;
        })
        res.json({
            message:"Connections fetched successfully",
            data
        })
}catch(err){
        res.status(400).send("Error :" + err.message);
    }
})

module.exports = userRouter;