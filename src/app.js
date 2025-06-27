const express= require('express');

const connectDB=require('./config/database');
const app = express();
const User= require("./models/user");
app.use(express.json()); //covert json object

app.post("/signup", async (req,res)=>{
   
    // Create a new user instance
    const user= new User(req.body);
    try{
        await user.save();
        res.send("User added Successfully");
    }catch(err){
        console.log(err);
        res.status(400).send("Error adding user");
    }
   } )


connectDB().then(()=>{
console.log("Database connected successfully!");
app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});
}).catch((err)=>{
    console.log(err);
})


connectDB().then(()=>{
console.log("Database connected successfully!");
app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});
}).catch((err)=>{
    console.log(err);
})

