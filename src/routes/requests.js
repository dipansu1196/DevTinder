const express= require('express');

const requestRouter=express.Router();
const {userAuth} = require("../middlewares/auth");
requestRouter.post("/sendConnectionRequest",userAuth,async(req,res)=>{
    const user= req.user;
    console.log("Sending a coonection request");
    res.send(user.firstName+" is sending a relationship request to Poconut");
})

module.exports = requestRouter;
