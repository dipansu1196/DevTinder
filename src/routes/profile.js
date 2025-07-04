const express= require('express');
const profileRouter=express.Router();
const User= require("../models/user");
const jwt = require('jsonwebtoken');    
const {userAuth} = require("../middlewares/auth");

profileRouter.get("/profile", userAuth, async(req,res)=>{
    try{
        const cookies = req.cookies;
        const {token} = cookies;
        if(!token){
            return res.status(401).send("Unauthorized: No token provided");
        }
        const decodedMessage = jwt.verify(token, "DEVTinder$790");
        const {_id} = decodedMessage;
        const user = await User.findById(_id);
        if(!user){
            return res.status(404).send("User not found");
        }
        res.send(user);
    }catch(err){
        res.status(400).send("Error fetching profile: " + err.message);
    }
})

module.exports = profileRouter;