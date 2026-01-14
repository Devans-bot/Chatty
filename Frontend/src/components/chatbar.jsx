import React, { useEffect } from 'react'
import { useChatStore } from '../store/usechatstore'
import { Cross, CrossIcon, RemoveFormatting, X } from 'lucide-react'
import { Link, useParams } from "react-router-dom";
import { useauthstore } from '../store/useauthstore';


const Chatbar = () => {

    const {selecteduser,setselecteduser}=useChatStore()
    const{onlineUsers}=useauthstore()

  

  return (
    <div className='sticky top-0 z-10 w-screen md:w-full rounded-b-xl h-16  bg-base-200 shadow-cl 

  flex items-center justify-between pr-3 pl-5   shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3)]
'>

       <div className='flex h-full  items-center'>
          <div className='h-12 w-12 rounded-full'>
            <img src={selecteduser.profilePic}
            className='h-12 w-12 object-cover rounded-full
            border-2 border-neutral '
             alt="" />
        </div>
        
         
        <div className='flex flex-col  text-xs items-start justify-start pl-2'>
         <Link to={`/userprofile/${selecteduser._id}`}>
            <span className='font-semibold'>
                {selecteduser.fullName}
            </span>
          </Link>
           {onlineUsers.includes(selecteduser._id)?<span>Online</span> :<span>Offline</span>}
        </div>
       </div>

       <div className='w-6 h-6 flex items-center justify-center rounded-full bg-base-200'>
        <X size={18}
        onClick={()=>setselecteduser(null)}
        />
       </div>
    </div>
  )
}

export default Chatbar
