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
requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
    try{
        const loggedInUser= req.user;
        // validate the status
        const allowedStatus= ["accepted","rejected"];
        const status= req.params.status;
        if(!allowedStatus.includes(status)){
            return res.status(400).send("Invalid status. Allowed values are 'accepted' or 'rejected'.");
        }
        // validate the requestId
        const requestId = req.params.requestId; // FIXED: Added missing requestId definition
        
        // ADDED: Debug logs to troubleshoot the issue
        
        
        const connectionrequest= await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id ,
            status:"interested"// Ensure the request belongs to the logged-in user
        })
        
        // ADDED: More debugging
        if(!connectionrequest){
            // Let's check if request exists at all
            const anyRequest = await ConnectionRequest.findById(requestId);
            console.log("Any request with this ID:", anyRequest);
            return res.status(404).send("Connection request not found or does not belong to the logged-in user.");
        }
        //loggedInUser=> toUserId
        //status= interested
        connectionrequest.status = status; // FIXED: Changed connectionRequest to connectionrequest
        await connectionrequest.save(); // Save the updated connection request
        res.json({
            message: `Connection request ${status} successfully.`,
            data: connectionrequest
        });

    }catch(err){
        console.error("Error reviewing connection request:", err);
        res.status(500).send("Internal Server Error: " + err.message); // ADDED: Missing error response
    }
})

// ADDED: Debug route to see all connection requests
requestRouter.get("/request/received", userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const requests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", "firstName lastName");
        
        res.json({
            message: "Received connection requests",
            data: requests
        });
    }catch(err){
        res.status(500).send("Error: " + err.message);
    }
});

module.exports = requestRouter;
