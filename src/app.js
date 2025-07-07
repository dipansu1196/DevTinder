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

const authRouter= require("./routes/auth");
const profileRouter= require("./routes/profile");
const requestRouter= require("./routes/requests");
const userRouter= require("./routes/user"); // ADDED: Import userRouter

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter); // ADDED: Use userRouter







connectDB().then(()=>{
    console.log("Database connected successfully!");
    app.listen(3000,()=>{
        console.log('Server is running on port 3000');
    });
}).catch((err)=>{
    console.log(err);
})