import React, { useEffect, useState } from 'react'
import { useauthstore } from '../store/useauthstore';
import { Mail, User } from 'lucide-react';
import { useChatStore } from '../store/usechatstore';
import { useParams } from 'react-router-dom';

const Userprofile = () => {
 
    
    const {getUserProfile,thisuser,addfrnd}=useauthstore()
    const {id}=useParams()
    const{getUsers}=useChatStore()
    const {users:friends}=useChatStore()

    const [FriendState,setFriendState]=useState(false)
    const isFriend = (id) =>
    friends?.some((friend) => friend._id === id);

    useEffect(()=>{
      getUsers()
    },[getUsers])

    useEffect(()=>{
        getUserProfile(id)
    },[id])

    
   const handlesubmit = () => {
  try {
    setFriendState(prev => !prev); // 👈 THIS IS REQUIRED
    addfrnd(id);
    getUsers();
  } catch (error) {
    console.log(error)
  }
}

     const memberSince = thisuser?.createdAt
  ? new Date(thisuser.createdAt).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short", // or "long"
      year: "numeric",
    })
  : "-";

  useEffect(() => {
  if (thisuser?._id) {
    setFriendState(isFriend(thisuser?._id));
  }
}, [friends, thisuser]);


   return (
    <div className="min-h-screen  w-full bg-base-100 text-base-content flex justify-center items-start py-10">
      <div className="w-11/12 md:w-4/12 bg-base-200/90 mt-10 border border-base-300 rounded-2xl shadow-lg flex flex-col items-center gap-6 px-6 py-10">
        {/* Header */}
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="font-bold text-lg">Profile</h3>
          <p className="text-sm text-base-content/70">
            User profile information
          </p>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center justify-center text-xs gap-3">
          <div className="h-24 w-24 relative rounded-full ring-2 ring-primary/40">
            <img
              src={
                thisuser?.profilepic ||
                "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
              }
              alt=""
              className="w-full h-full object-cover rounded-full"
            />
           
          </div>
          <button onClick={handlesubmit} className={`h-8 w-24 font-semibold rounded-xl text-base-content/70 text-xs  
             ${FriendState
             ? "bg-green-500 border-green-700 text-white"
           : "bg-red-500 border-red-700 text-white"}
            `}>
           <span>
             {FriendState? "Add friend" : "Remove friend"}
            </span>
          </button>
        </div>

        {/* Fields */}
        <div className="w-full space-y-3">
          {/* Full name */}
          <div className="w-full p-2 flex flex-col items-start gap-1.5">
            <div className="flex gap-2 items-center text-xs text-base-content/70">
              <User className="size-4" />
              <p>Full name</p>
            </div>
            <div className="w-full text-sm bg-base-100/80 border border-base-300 flex h-10 rounded-xl px-3 items-center">
              <h3 className="truncate">
                {thisuser?.name || "Full name"}
              </h3>
            </div>
          </div>

          {/* Email */}
          <div className="w-full p-2 flex flex-col items-start gap-1.5">
            <div className="flex gap-2 items-center text-xs text-base-content/70">
              <Mail className="size-4" />
              <p>Email</p>
            </div>
            <div className="w-full text-sm bg-base-100/80 border border-base-300 flex h-10 rounded-xl px-3 items-center">
              <h3 className="truncate">
                {thisuser?.email || "Email address"}
              </h3>
            </div>
          </div>
        </div>

        {/* Account info */}
        <div className="w-full px-4 pt-2">
          <h2 className="font-bold pb-4 text-sm">Account information</h2>

          <div className="text-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3>Member since</h3>
              <h3 className="text-base-content/80">{memberSince}</h3>
            </div>

            <div className="w-full">
              <svg
                className="w-full h-[1px] text-base-content/20"
                viewBox="0 0 100 1"
                preserveAspectRatio="none"
              >
                <line
                  x1="0"
                  y1="0.5"
                  x2="100"
                  y2="0.5"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </svg>
            </div>

            <div className="flex items-center justify-between">
              <h3>Account status</h3>
              <h3 className="text-success font-medium">Active</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Userprofile
