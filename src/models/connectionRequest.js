const mongoose= require('mongoose');

const connectionRequestSchema= new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,

    },
    toUserId:{ // FIXED: Changed from 'toStringerId' to 'toUserId' to match route usage
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    status:{
        type:String,
        enum:{
            values:["ignored","pending","accepted","rejected","interested"],
           message:`{VALUE} is not a valid status. Valid values are 'pending', 'accepted', or 'rejected'`
        },
           default:"pending",
           required:true,
    },

},{
    timestamps:true,
})

connectionRequestSchema.index({fromUserId:1, toUserId:1}, {unique:true}); // FIXED: Added index for unique constraint

connectionRequestSchema.pre("save",async function(next){
    //check if the fromUserId and toUserId are the same
    if(this.fromUserId.toString() === this.toUserId.toString()){
        throw new Error("You cannot send a connection request to yourself.");
    }
    next();
})
const ConnectionRequest= mongoose.model("ConnectionRequest",connectionRequestSchema);
module.exports= ConnectionRequest;