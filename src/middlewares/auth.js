 const adminAuth= (req,res,next)=>{
    const token= "xyz123";
    const isAdminAuthorized= token=== "xyz123";
    if(isAdminAuthorized){
        next();
    } else {
        res.status(403).send({message: "Access denied"});
    }
};

const userAuth= (req,res,next)=>{
    const token= "xyz123";
    const isAdminAuthorized= token=== "xyz123";
    if(isAdminAuthorized){
        next();
    } else {
        res.status(403).send({message: "Access denied"});
    }
};
module.exports = { adminAuth,userAuth};