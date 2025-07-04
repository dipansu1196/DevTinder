const express= require("express");
const authRouter= express.Router();
const { validateSignupData } = require("../utils/validation");
const bcrypt= require("bcrypt");
const User= require("../models/user");
const validator = require("validator");
const jwt = require("jsonwebtoken");
// Middleware to check if the user is authenticated
authRouter.post("/signup", async (req,res)=>{
    try{
        validateSignupData(req.body);    
        const {firstName,lastName,email, password,age,skills}= req.body;
        const passwordHash= await bcrypt.hash(password,10);
        const user= new User({
            firstName,
            lastName,
            email,
            age,
            skills,
            password:passwordHash,
        });
        await user.save();
        res.send("User added Successfully");
    }catch(err){
        console.log(err);
        res.status(400).send("Error adding user: " + err.message);
    }
})

authRouter.post("/login",async (req,res)=>{
    try{
        const {email,password}= req.body;
        const user= await User.findOne({email:email});
        if(!user){
            return res.status(404).send("email not present in database");
        }
        if(validator.isEmail(email) === false){
            return res.status(400).send("Email is not valid");
        }
        const isPasswordValid= await user.validatePassword(password);
       
        if(isPasswordValid){
   // created a jwt token for the user
            const token = await user.getJWT();
            
        
            res.cookie("token",token,{
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
            });
            res.send("Login successful");
        } else {
            return res.status(401).send("Invalid password Please Try Again");
        }
    }catch(err){
        res.status(400).send("Error logging in: " + err.message);
    }
})

module.exports = authRouter;