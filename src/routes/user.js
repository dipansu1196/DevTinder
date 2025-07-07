const express = require('express');
const userRouter = express.Router();
const User = require("../models/user");
const {userAuth}= require("../middlewares/auth");
const { Connection } = require('mongoose');
const ConnectionRequest = require("../models/connectionRequest");

// FIXED: Get all the pending connection requests for the logged-in user
userRouter.get("/user/requests/received",userAuth,async(req,res)=>{
    try{
        const loggedInUser= req.user;
        const connectionRequests= await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status:"interested"
        }).populate("fromUserId", "firstName lastName email photoUrl about skills");
        
        res.json({
            message: "Received connection requests",
            data: connectionRequests
        });
        
    }catch(err){
        res.status(500).send("Internal Server Error: " + err.message);
    }
})

// ADDED: Separate route for user feed
userRouter.get("/feed",userAuth,async(req,res)=>{
    try{
        const loggedInUser= req.user;
        const connectionRequests= await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        });

        const hideUsersFromFeed= new Set();
        connectionRequests.forEach(request => {
            hideUsersFromFeed.add(request.fromUserId.toString());
            hideUsersFromFeed.add(request.toUserId.toString());
        });

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } },
            ],
        }).select("firstName lastName photoUrl about skills age"); // FIXED: Removed extra spaces and used single string format
        
        res.json({
            message: "Feed users",
            data: users
        });
        
    }catch(err){
        res.status(500).send("Internal Server Error: " + err.message);
    }
})

// ADDED: Missing module.exports
module.exports = userRouter;