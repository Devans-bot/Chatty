import mongoose from "mongoose"

const messageschema= new mongoose.Schema({

    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    image:{
        type:String,
        default:null,
    },
   cipherText:{
    type:String,
   },
   iv:{
    type:String,
   }
},{
    timestamps:true
})

const Message=mongoose.model("Message",messageschema)

export default Message;