const express= require('express');
const app = express();
app.get("/user/:userid",(req, res) => {
    console.log(req.params);
    res.send({firstname: "John", lastname: "Doe"});
});
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

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});
