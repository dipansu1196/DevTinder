const express= require('express');
const bcrypt= require("bcrypt");
const connectDB=require('./config/database');
const app = express();
const validator = require('validator');
const User= require("./models/user");
app.use(express.json());
const cookieParser= require("cookie-parser")
const { validateSignupData } = require("./utils/validation");
const jwt = require('jsonwebtoken');
app.use(cookieParser());
const {userAuth}= require("./middlewares/auth");

app.post("/signup", async (req,res)=>{
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

app.get("/profile", userAuth, async(req,res)=>{
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

app.post("/login",async (req,res)=>{
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
            
        
            res.cookie("token",token);
            res.send("Login successful");
        } else {
            return res.status(401).send("Invalid password Please Try Again");
        }
    }catch(err){
        res.status(400).send("Error logging in: " + err.message);
    }
})

app.get("/user",async (req,res)=>{
    const email= req.body.email;
    try{
        const user= await  User.find({email:email})
        if(user.length === 0){
            return res.status(404).send("User not found");
        }
        res.send(user);
    }catch(err){
        console.log(err);
        res.status(400).send("Error finding user");
    }
})

app.get("/feed",async (req,res)=>{
    try{
        const users= await User.find({});
        res.send(users);
    }catch(err){
        res.status(400).send("Error fetching feed");
    }
})

app.delete("/user",async (req,res)=>{
    const userId= req.body.userId;
    try{
        const user= await User.findByIdAndDelete(userId);
        res.send("User deleted successfully");
    }catch(err){
        res.status(400).send("Error deleting user");
    }
})

app.patch("/user/:userId",async(req,res)=>{
    const data =req.body;
    const userId= req.params?.userId;
    try{
        const ALLOWED_UPDATES= ["password","about","skills","gender","photoUrl"];
        const isUpdateAllowed= Object.keys(data).every((update)=> ALLOWED_UPDATES.includes(update));
        if(!isUpdateAllowed){
            throw new Error("Update not allowed");
        }
        const user = await User.findByIdAndUpdate({
            _id:userId
        },data,{returnDocument: 'after',runValidators: true});
        res.send("User updated successfully");
    }catch(err){
        res.status(400).send("Error updating user");
    }
})

app.post("/sendConnectionRequest",userAuth,async(req,res)=>{
    const user= req.user;
    console.log("Sending a coonection request");
    res.send(user.firstName+" is sending a relationship request to Poconut");
})

connectDB().then(()=>{
    console.log("Database connected successfully!");
    app.listen(3000,()=>{
        console.log('Server is running on port 3000');
    });
}).catch((err)=>{
    console.log(err);
})