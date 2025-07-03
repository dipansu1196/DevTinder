const adminAuth= (req,res,next)=>{
    const token= "xyz123";
    const isAdminAuthorized= token=== "xyz123";
    if(isAdminAuthorized){
        next();
    } else {
        res.status(403).send({message: "Access denied"});
    }
};

const jwt= require("jsonwebtoken");
const User= require("../models/user");

const userAuth= async (req,res,next)=>{
    try{ 
        const {token}= req.cookies;
        if(!token){
            return res.status(401).send({message: "Unauthorized access"});
        }
        const decodedObj = jwt.verify(token, "DEVTinder$790",{expiresIn:"1d"});
        const{_id}= decodedObj;
        const user= await User.findById(_id);
        if(!user){
            return res.status(404).send({message: "User not found"});
        }
        req.user = user;
        next();
    }catch(err){
        console.error("Error in userAuth middleware:", err);
        res.status(500).send({message: "Internal server error: " + err.message});
    }
};

module.exports = { adminAuth,userAuth};