
const validator= require('validator');
const validateSignupData = (data) => {
    const {firstName,lastName,email,password}= data;
    if(!firstName||!lastName){
        throw new Error("First name and last name are required");
    }else if(firstName.length<3||lastName.length<3){
        throw new Error("First name and last name must be at least 3 characters long");
    }else if(!email){
        throw new Error("Email is required");
    }else if(!password){
        throw new Error("Password is required");
    }else if(password.length<8){
        throw new Error("Password must be at least 8 characters long");
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character");
    } 
    else if(!validator.isEmail(email)){
        throw new Error("Email is invalid");
    }


}
const validateEditProfileData = (data) => {
    const allowedEditfields = ['firstName', 'lastName', 'email', 'age', 'skills'];
    const isEditAllowed= Object.keys(data).every((key) => allowedEditfields.includes(key));
    if(!isEditAllowed){
        throw new Error("Invalid fields for editing profile");
    }
}
module.exports={validateSignupData,validateEditProfileData};