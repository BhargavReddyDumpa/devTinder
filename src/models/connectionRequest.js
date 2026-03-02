const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },
    status:{
        type: String,
        rquired: true,
        enum:{
            values:["accepted","interested","ignored","rejected"],
            message:`{VALUE} is incorrect status type`,
        },
    },
},
{timestamps:true}
);

const ConnectionRequest = new mongoose.model(
    "ConnectionRequest",
    connectionRequestSchema
);

module.exports = ConnectionRequest;