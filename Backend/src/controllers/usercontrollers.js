import User from "../models/usermodel.js"
import bcrypt from 'bcryptjs'
import GenerateToken from "../utils/generateToken.js"
import cloudinary from '../utils/cloudinary.js'
import { userSocketMap } from "../utils/socket.js"
import { io } from "../utils/socket.js"

export const signup =async(req,res)=>{
        const {email,username,fullName,password}=req.body    

 try {
        
     if(!email || !fullName || !username|| !password )return res.status(400).json({message:"Please give details"})
    
      let user=await User.findOne({email})
     if(user)return res.status(404).json({message:"Already a user with this email"})

     const exists=await User.exists({username})
     if(exists)return res.status(409).json({
        success:false,
        message:"This username isn't available ! 😔"
    })

    const profilePic = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}-${Date.now()}`;

     const hashpassword=  await bcrypt.hash(password,10)
     
     user =await User.create({
        email,
        username,
        fullName,
        password:hashpassword,
        profilePic,
     })

     GenerateToken(user._id,res)

     res.status(200).json({
        message:"User created",
        user:{
            _id:user._id,
            fullName:user.fullName,
            username:user.username,
            email:user.email,
            profilepic:user.profilePic,
        }
     })
     
 } catch (error) {
    console.log(error)
 }
}



export const login=async(req,res)=>{
        const {email,password}=req.body

 try {

     if(!email || !password )return res.status(400).json({message:"Please give details"})

    let user=await User.findOne({email})
    if(!user)return res.status(404).json({message:"No user with this email"})

    const pass=await bcrypt.compare(password,user.password)

    if(!pass)return res.status(400).json({message:"Wrong password"})
   
    GenerateToken(user._id,res)

     res.status(200).json({
        user:{
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilepic:user.profilePic,
        }
     })
     
 } catch (error) {
    console.log(error)
 }
}

export const logout=(req,res)=>{
    try {
        res.cookie("token","",{maxAge:0})
        res.json({messaged:"logged out"})
    } catch (error) {
        console.log(error)
    }
}

export const profilepic=async(req,res)=>{
    try {
        const {profilepic}=req.body
         if (!req.user) {
  return res.status(401).json({ message: "Unauthorized" });
}
        const user= req.user._id
       

        if(!profilepic)return res.status(401).json({message:"Provide pic !"})

        const uploadresponse= await cloudinary.uploader.upload(profilepic)
        const updateduser=await User.findOneAndUpdate(user,{profilePic:uploadresponse.secure_url},{new:true})

        res.json(updateduser)
    } catch (error) {
        console.log(error)
    }
}

export const checkauth=async(req,res)=>{
    try {
         if (!req.user) {
  return res.status(401).json({ message: "Unauthorized" });
}      

        res.json(req.user)
    } catch (error) {
        console.log(error)
    }
}


export const getuserprofile=async(req,res)=>{
    try {
        const {id}=req.params
         if (!req.user) {
  return res.status(401).json({ message: "Unauthorized" });
}
        const userprofileid=await User.findById(id)


        res.json({
            name:userprofileid.fullName,
            profilepic:userprofileid.profilePic,
            email:userprofileid.email,
            createdAt:userprofileid.createdAt
        })
    } catch (error) {
        console.log(error)
    }
}


export const getfriend=async(req,res)=>{
    try {
        const {username}=req.body

        const keyword=username.trim()
         
        const users=await User.find({
            $or:[
                {username:{$regex:keyword,$options:"i"}},
                {fullName:{$regex:keyword,$options:"i"}},
            ]
        }).select("fullName username profilePic createdAt email").limit(10)

        if(users.length===0)return res.status(404).json({message:"User not found"})

       return res.json(users)
    } catch (error) {
        console.log(error)
    }
}

export const allfriends=async(req,res)=>{
    try {
         if (!req.user) {
  return res.status(401).json({ message: "Unauthorized" });
}
        const userid=req.user._id
     

        const user =await User.findById(userid).populate("friends","fullName profilePic createdAt ")
        res.json(user.friends)
    } catch (error) {
        console.log(error)
    }
}


export const addfriend = async (req, res) => {
  try {
     if (!req.user) {
  return res.status(401).json({ message: "Unauthorized" });
}
    const userId = req.user._id;

    const user = await User.findById(userId);
    const friendId = req.params.id;
    const frnd=await User.findById(friendId)

    let message = "";

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter(
        (id) => id.toString() !== friendId
      );
       frnd.friends = frnd.friends.filter(
        (id) => id.toString() !== userId.toString()
      );
      message = "Removed friend 😔 ";
    } else {
        
      if(user.friendRequests.includes(friendId))

      user.friendRequests = user.friendRequests.filter(
        id => id.toString() !== friendId.toString() 
       );  
      user.friends.push(friendId);
      frnd.friends.push(userId)
      message = "Added friend 😉";
       
 }

    await user.save();
    await frnd.save()


    const userSockets = userSocketMap[userId.toString()];
    const friendSockets = userSocketMap[friendId.toString()];

   if (userSockets) {
  [...userSockets].forEach(socketId => {
    io.to(socketId).emit("friend:update", {
      action: "add_or_remove",
      by: userId,
    });
  });
}

if (friendSockets) {
  [...friendSockets].forEach(socketId => {
    io.to(socketId).emit("friend:update", {
      action: "add",
      by: userId,
    });
  });
}


    // Now return friend list + message in ONE response
    const friendList = await User.findById(userId).populate("friends");

    return res.json({
      message,
      friends: friendList.friends,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};



export const sendrequest=async(req,res)=>{
    try {
       if (!req.user) {
  return res.status(401).json({ message: "Unauthorized" });
}
    const userId = req.user._id;
  
    const user = await User.findById(userId);
    const friendId = req.params.id;

    if(userId.toString()===friendId.toString())return res.status(200).json({message:"No user found 😩"})

        const frnd=await User.findById(friendId)

    if(user.friends.includes(friendId))return res.status(200).json({message:"You both are already friends 😘"})

    if(frnd.friendRequests.includes(userId))return res.status(200)
   .json({message:"Already sent a request 😁"})

    frnd.friendRequests.push(userId)

    await frnd.save()
     
     const receiverSockets = userSocketMap[friendId.toString()];

    if (receiverSockets) {
  [...receiverSockets].forEach(socketId => {
    io.to(socketId).emit("friendRequest:new", {
      from: {
        _id: user._id,
        fullName: user.fullName,
        profilePic: user.profilePic,
      },
    });
  });
}

    res.json({message:`Chat request send to ${frnd.fullName} ☺️`})
    } catch (error) {
        console.log(error)
    }
}


export const friendRequests=async(req,res)=>{
    try {
       if (!req.user) {
  return res.status(401).json({ message: "Unauthorized" });
}
        const userId=req.user._id

        const user=await User.findById(userId)


        if(!user || user.friendRequests.length===0){
            return res.json([])
        }
       const requestsUsers = await User.find({
      _id: { $in: user.friendRequests },
    }).select("_id fullName profilePic");

      
        res.json(requestsUsers)
    } catch (error) {
        console.log(error)
    }
}


export const removeRequests =async(req,res)=>{
    try {
       if (!req.user) {
  return res.status(401).json({ message: "Unauthorized" });
}
        const userid=req.user._id

        const user=await User.findById(userid)

        user.friendRequests=[]
         await user.save();

    res.status(200).json({
      message: "Requests removed.. 😖",
      friendRequests: user.friendRequests,
    });

    } catch (error) {
        console.log(error)
    }
}