const mongoose = require('mongoose');
const userSchema= new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        
    },
    lastName:{  
        type:String,
        
       
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        
    },
    password:{
        type:String,
        required:true,
        minLength:8,
        maxLength:40,
        
    },
    photoUrl:{
        type:String
    },
    about:{
        type:String,
        default:"This is default user description",

    },
    skills:{
        type:[String],
        default: [],
    },
    age:{
        type:Number,
        min:18,
        max:100,
        required:true,
    },
    gender:{
        type:String,
        validate(value){
      if(!["male","female","other"].includes(value)){
          throw new Error("Gender data is not valid");
        }
    }
},
   
},{
    timestamps:true,
    versionKey:false
});

const User=mongoose.model('User',userSchema);
module.exports= User;
// This code defines a Mongoose schema for a User model in a Node.js application. The