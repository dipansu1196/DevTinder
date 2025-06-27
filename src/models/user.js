const mongoose = require('mongoose');
const userSchema= new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        
    },
    lastName:{  
        type:String,
        required:true,
       
    },
    email:{
        type:String,
        
    },
    password:{
        type:String,
        
    }
   
});

const User=mongoose.model('User',userSchema);
module.exports= User;
// This code defines a Mongoose schema for a User model in a Node.js application. The