const mongoose = require('mongoose');
const validator = require('validator');
const userSchema= new mongoose.Schema({
    firstName:{

        type:String,
        required:true,
        index:true,
        
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
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is not valid: " + value);
            }
        }
        
    },
    password:{
        type:String,
        required:true,
        minLength:8,
        maxLength:100,
        validate(value){
            if(!validator.isStrongPassword(value, {
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 0
            })){
                throw new Error("Password is not strong enough");
            }
        }
        
    },
    photoUrl:{
        type:String,
        default:"https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Photo URL is not valid: " + value);
            }
        }
    },
    about:{
        type:String,
        default:"This is default user description",

    },
    skills:{
        type:[String],
        default: [],
        validate: {
            validator: function(skills) {
                if (skills.length < 1 || skills.length > 20) {
                    throw new Error('Skills must have between 1 and 20 items');
                }
                return true;
            },
            message: 'Skills must have between 1 and 20 items'
        }   
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
userSchema.methods.getJWT= async function (){
  const user= this;
  const jwt= require('jsonwebtoken');

  const token= jwt.sign({_id:user._id},"DEVTinder$790",{expiresIn:"1d"});
  return token;


}
userSchema.methods.validatePassword= async function (passwordInputByUser){
    const user= this;
    const bcrypt= require('bcrypt');
    const isPasswordValid= await bcrypt.compare(passwordInputByUser,user.password);
    return isPasswordValid;
}
userSchema.index({email:1},{unique:true}); // Ensure email is unique
userSchema.index({firstName:1, lastName:1}); // FIXED: Removed extra closing parenthesis
const User=mongoose.model('User',userSchema);
module.exports= User;
// This code defines a Mongoose schema for a User model in a Node.js application. The