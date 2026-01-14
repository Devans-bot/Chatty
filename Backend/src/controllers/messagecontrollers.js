
import Message from "../models/messagemodel.js"
import User from "../models/usermodel.js"
import cloudinary from "../utils/cloudinary.js"
import { getReceiverSocketId, io } from "../utils/socket.js"

export const getusersforsidebar=async(req,res)=>{
    try {
        const loggedinuser=req.user._id
        const users=await User.find({_id:{$ne:loggedinuser}}).select("-password")

        res.json(users)  
    } catch (error) {
        console.log(error)
    }
}

export const getmessages=async(req,res)=>{
    try {
       const {id:usertochatid}=req.params
       const myid=req.user._id

       const messages= await Message.find({
        $or:[
            {
              senderId:myid , receiverId:usertochatid
            },
            {
                senderId:usertochatid,receiverId:myid
            }
        ]
       })

       res.json(messages)
    } catch (error) {
        console.log(error)
    }
}

export const sendmessages = async (req, res) => {
  try {
    const senderId = req.user._id;
    const receiverId = req.params.id;

    let imageUrl = null;

    if (req.body.image) {
      const upload = await cloudinary.uploader.upload(req.body.image, {
        folder: "chat-images",
      });
      imageUrl = upload.secure_url;
    }

    const message = await Message.create({
      senderId,
      receiverId,
      cipherText: req.body.cipherText || null,
      encryptedKey: req.body.encryptedKey || null,
      iv: req.body.iv || null,
      image: imageUrl,
    });

  const receiverSocketId = getReceiverSocketId(receiverId);

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("receiveMessage", message);
  }

    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send message" });
  }
};
