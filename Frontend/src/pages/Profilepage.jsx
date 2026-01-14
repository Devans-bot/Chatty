import { Camera, Mail, User } from 'lucide-react'
import React, { useState } from 'react'
import { useauthstore } from '../store/useauthstore'


// Compress file -> base64 (jpeg) using canvas
const compressImage = (file, maxWidth = 400, maxHeight = 400, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        // keep aspect ratio, but limit max width/height
        const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
        width *= ratio;
        height *= ratio;

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // quality: 0–1 (1 = best, biggest)
        const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedBase64);
      };

      img.onerror = reject;
      img.src = e.target.result;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};




const Profilepage = () => {

  const {authUser,isUpdatingProfile,updateProfile}=useauthstore()
  const [selectedImg,setselectedImg]=useState("")



  const memberSince = authUser?.createdAt
  ? new Date(authUser.createdAt).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short", // or "long"
      year: "numeric",
    })
  : "-";


  const handlechange=(e)=>{
    const file=e.target.files[0]
    if(!file)return
    const reader=new FileReader()

    reader.readAsDataURL(file)

    reader.onload=async()=>{
      const base64img=await compressImage(file, 400, 400, 0.7); 
      setselectedImg(base64img)
      await updateProfile({profilepic:base64img})
    }


  }

  return (
    <div className="min-h-screen  w-full bg-base-100 text-base-content flex justify-center items-start py-10">
      <div className="w-11/12 md:w-4/12 bg-base-200/90 mt-10 border border-base-300 rounded-2xl shadow-lg flex flex-col items-center gap-6 px-6 py-10">
        {/* Header */}
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="font-bold text-lg">Profile</h3>
          <p className="text-sm text-base-content/70">
            Your profile information
          </p>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center justify-center text-xs gap-3">
          <div className="h-24 w-24 relative rounded-full ring-2 ring-primary/40">
            <img
              src={
                selectedImg ||
                authUser?.profilePic ||
                "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
              }
              alt=""
              className="w-full h-full object-cover rounded-full"
            />
            <label
              className="
                absolute bottom-0 right-0
                bg-base-100 border border-base-300
                w-7 h-7
                rounded-full
                flex items-center justify-center
                cursor-pointer
                shadow-sm
              "
            >
              <Camera className="size-4 text-base-content" />
              <input
                type="file"
                className="hidden"
                onChange={handlechange}
                accept="image/*"
              />
            </label>
          </div>
          <h3 className="text-xs text-base-content/70">
            {isUpdatingProfile
              ? "Uploading..."
              : "Click the camera icon to update your photo"}
          </h3>
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
                {authUser?.fullName || "Full name"}
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
                {authUser?.email || "Email address"}
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
};


export default Profilepage
