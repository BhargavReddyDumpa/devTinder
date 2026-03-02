const express = require("express")
const requestRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user")

requestRouter.post("/request/send/:status/:toUserId",userAuth, async(req,res)=>{
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        const allowedStatus = ["ignored","interested"];
        if(fromUserId.equals(toUserId)){
            return res.status(404).json({
                message:"cannot send request to yourself",
            })
        };
        if(!allowedStatus.includes(status)){
            // throw new Error("Url is not correct");
            return res.status(400).json({
                message: "invalid status type "+status
            })
        }
        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(400).json({
                message:"user not found",
            })
        }
        // If there is an existing ConnectionRequest
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId, toUserId:fromUserId},
            ],
        });
        if(existingConnectionRequest){
            return res.status(400).json({
                message:"Connection Request Already Exists!!",
            })
        }
        const data = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });
        await data.save();
        res.json({
            message:req.user.firstName + " is " + status + " in " + toUser.firstName,
            data,
        })
    }catch(err){
        res.status(400).send("Cannot send the request :" + err.message);
    }
})

module.exports = requestRouter;