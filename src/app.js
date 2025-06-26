const express= require('express');
const app = express();

app.post("/user",(req,res)=>{
    res.send({message: "User created successfully!"});
})
app.use("/test",(req,res,next)=>{

    res.send("Hello World from Express!");
    next();
     // due to next(), the request will continue to the next handler
},(req, res)=>{
    res.send("Hello World from second route handler!");
}); 

const { adminAuth,userAuth } = require('./middlewares/auth');

app.use("/admin", adminAuth);
app.get("/admin/dashboard",(req,res)=>{
    res.send({message: "Welcome to the admin dashboard!"});
})
app.use("/admin/deleteUser",(req,res,next)=>{
    res.send({message: "User deleted successfully!"});
 })
 app.get("/user/:userid",userAuth,(req, res) => {
    console.log(req.params);
    res.send({firstname: "John", lastname: "Doe"});
});

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});
