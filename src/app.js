const express= require('express');
const app = express();
app.get("/user/:userid",(req, res) => {
    console.log(req.params);
    res.send({firstname: "John", lastname: "Doe"});
});
app.post("/user",(req,res)=>{
    res.send({message: "User created successfully!"});
})
app.use("/test",(req,res)=>{

    res.send("Hello World from Express!");
})

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});