const express= require('express');

const requestRouter=express.Router();
const {userAuth} = require("../middlewares/auth");
const User = require("../models/user"); // ADDED: Import User model
requestRouter.post("/sendConnectionRequest",userAuth,async(req,res)=>{
    const user= req.user;
    console.log("Sending a coonection request");
    res.send(user.firstName+" is sending a relationship request to Poconut");
})
  const ConnectionRequest= require("../models/connectionRequest");
requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
   try{
     const fromUserId= req.user._id;
    const toUserId = req.params.toUserId;
    const status= req.params.status;
    const allowedStatus= ["ignored","interested"];
    if(!allowedStatus.includes(status)){
        return res.status(400).send("Invalid status. Allowed values are 'ignored' or 'interested'.");
    }
    const toUser= await User.findById(toUserId);
    if(!toUser){
        return res.status(404).send("User not found");
    }
   
    // Check if the fromUserId and toUserId are the same

    // If There is an existing ConnectionRequest
    const existingRequest = await ConnectionRequest.findOne({
        $or:[ // FIXED: Changed from object to array syntax for $or
            { fromUserId, toUserId },
            { fromUserId: toUserId, toUserId: fromUserId} // FIXED: Removed extra dot This is Condition 1
        ],
    })
    if(existingRequest){
        return res.status(400).send("Connection request already exists between these users.");
    }
    

    const connectionRequest= new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
    });
    const data = await connectionRequest.save();
   res.status(201).json({
       message: req.user.firstName +"is"+status+"in with "+toUser.firstName,
       data: data
   })
   
}catch(err){
         console.error("Error sending connection request:", err);
         res.status(500).send("Internal Server Error"+err.message);
   }
})

module.exports = requestRouter;
