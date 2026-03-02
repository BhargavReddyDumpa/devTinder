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

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req,res)=>{
    // need to validate status and requestID
    // status should be interested send by other user (requestID) to loggedin user
    // check status and update it
    try{
        const loggedinUser = req.user;
        const {status, requestId} = req.params;
        const allowedstatus = ["accepted","rejected"];
        if(!allowedstatus.includes(status)){
            return res.status(400).json({
                message:"Status not allowed"
            })
        }
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedinUser._id,
            status: "interested"
        })
        if(!connectionRequest){
            return res.status(400).json({
                message:"Connect request not found"
            })
        }
        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({
            message:"Conection request " + status, 
            data
        })
    } catch(err){
        res.status(400).send("Error:" + err.message);
    }
})

module.exports = requestRouter;