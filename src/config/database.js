const mongoose = require('mongoose');
const connectDB= async()=>{
    await mongoose.connect("mongodb+srv://dipansuchoudhary873:Dipu1234@cluster0.ucw8j.mongodb.net/devTinder", {
        // ADDED: SSL options to fix connection issues
        ssl: true,
        tlsAllowInvalidCertificates: true
    });
};

module.exports= connectDB;