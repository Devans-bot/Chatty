import mongoose from "mongoose";

const userschema =  new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    fullName:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        require:true,
        minlength:8,
    },
    profilePic:{
        type:String,
        default:""
    },
    friends:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        }
    ],
    friendRequests: [
    {
           type:mongoose.Schema.Types.ObjectId,
            ref:"User",
    }
],

},
    {timestamps:true}
)

const User= mongoose.model("User",userschema)

export default User