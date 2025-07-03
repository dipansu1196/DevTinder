const express= require('express');
const bcrypt= require("bcrypt");
const connectDB=require('./config/database');
const app = express();
const validator = require('validator');
const User= require("./models/user");
app.use(express.json());
const cookieParser= require("cookie-parser") //covert json object
const { validateSignupData } = require("./utils/validation");
const jwt = require('jsonwebtoken');
app.use(cookieParser());
app.post("/signup", async (req,res)=>{
   
   
    try{
        // Validation Of data
      validateSignupData(req.body);    

   //Encrypt the password
   const {firstName,lastName,email, password,age,skills}= req.body;
   const passwordHash= await bcrypt.hash(password,10);
   console.log(passwordHash);

    // Create a new user instance
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
   } )
app.get("/profile", async(req,res)=>{
 try{   const cookies= req.cookies;
    const{token}= cookies;
    if(!token){
        return res.status(401).send("Unauthorized: No token provided");
    }
    const decodedMessage= await jwt.verify(token, "DEVTinder$790");
    console.log(decodedMessage);
    const{_id}= decodedMessage;
    console.log("Logged In Use id is: ", _id);
    console.log(cookies);
    const user= await User.findById(_id);
    if(!user){
        return res.status(404).send("User not found");
    }
    res.send(user);}catch(err){
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
        const isPasswordValid= await bcrypt.compare(password, user.password);
        if(isPasswordValid){

            //Create a JWT Token
            const token = jwt.sign({_id:user._id}, "DEVTinder$790");
            console.log(token);

            // Add the token to cookie and send the response back to the user
            res.cookie("token",token);
            res.send("Login successful");
        } else {
            return res.status(401).send("Invalid password Please Try Again");
        }
    }catch(err){
        res.status(400).send("Error logging in: " + err.message);
    }
})
// find user by email
app.get("/user",async (req,res)=>{
    const email= req.body.email;
 try{const user= await  User.find({email:email})
 if(user.length === 0){
     return res.status(404).send("User not found");
 }
 res.send(user);
}
catch(err){
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

// Update user by email
app.patch("/user/:userId",async(req,res)=>{
    const data =req.body;
    const userId= req.params?.userId;
    
    try{
         const ALLOWED_UPDATES= ["password","about","skills","gender","photoUrl"];
    const isUpdateAllowed= Object.keys(data).every((update)=> ALLOWED_UPDATES.includes(update));
    if(!isUpdateAllowed){
        throw new Error("Update not allowed");
    }
 const user=   await User.findByIdAndUpdate({
        _id:userId
    },data,{returnDocument: 'after',runValidators: true});
  //  console.log(user);
    res.send("User updated successfully");
    }catch(err){
        res.status(400).send("Error updating user");
    }

})
connectDB().then(()=>{
console.log("Database connected successfully!");
app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});
}).catch((err)=>{
    console.log(err);
})



