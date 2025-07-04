const express= require('express');
const profileRouter=express.Router();
const User= require("../models/user");
const jwt = require('jsonwebtoken');    
const {userAuth} = require("../middlewares/auth");
const {validateEditProfileData} = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async(req,res)=>{
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

profileRouter.patch("/profile/edit",userAuth, async(req,res)=>{
    try{
        validateEditProfileData(req.body);

        const user= req.user;
        Object.keys(req.body).forEach((key) => {
            user[key] = req.body[key];
        });
        await user.save();
        console.log(user);
                res.json({message:`${user.firstName}, Profile updated successfully`,
                data:user
                });
    }
    catch(err){
        return res.status(400).send("Validation error: " + err.message);
    }
})
module.exports = profileRouter;