const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const { set } = require("mongoose");
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
userRouter.get("/user/feed", userAuth, async(req,res)=>{
    try{
        const loggedinuser = req.user;
        // /user/feed?page=1&limit=10 (this is not params it is query)
        // we may not put in router but this is how we have to send in 
        // url.
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page-1)*limit;
        const connectionRequests = await ConnectionRequest.find({
            $or:[{fromUserId: loggedinuser._id},
            {toUserId: loggedinuser._id}
        ]
        }).select("fromUserId toUserId")
        const hideUserfromFeed = new Set();
        connectionRequests.forEach((req)=>{
            hideUserfromFeed.add(req.fromUserId);
            hideUserfromFeed.add(req.toUserId);
        })
        const user = await User.find({
            $and:[{_id:{$nin: Array.from(hideUserfromFeed)}},
                {_id:{$ne: loggedinuser._id}}
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);
        res.send(user);
    }catch(err){
        res.status(400).send("Error: " + err.message);
    }
})


module.exports = userRouter;