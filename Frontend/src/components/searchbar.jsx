import React from 'react'
import { useauthstore } from '../store/useauthstore';
import { useState } from 'react';
import ChatSkeleton from '../skeletons/chat';
import { ArrowBigLeft, Cross, Plus, Send, User, UserPlus, X } from 'lucide-react';
import { useEffect } from 'react';
import useOutsideClick from './useoutside';
import { useRef } from 'react';
import {gsap} from 'gsap';
import { useChatStore } from '../store/usechatstore';
import { Link } from 'react-router-dom';

const Searchfrineds = () => {


    const {searchfrnd,searchedusers,sendrequest}=useauthstore()
    const [name,setname]=useState("")
    const containerref=useRef(null)
    const itemsref=useRef([])
    const tl=useRef(null)
    const [display,setdisplay]=useState(false)


   const {users:friends}=useChatStore()
   const{getUsers}=useChatStore()

   useEffect(()=>{
    getUsers()
   },[getUsers])

    const isFriend = (id) =>
    friends?.some((friend) => friend._id === id);

    
    const handlesubmit=async(e)=>{
        e.preventDefault()
        
        console.log(name)
        if(!name.trim())return

       const result= await searchfrnd(name)

       if(result)
       {
        setdisplay(true)
       }
       setname("")
    }

    const handlesendreqst=async(id)=>{
      try {
       await sendrequest(id)
      } catch (error) {
        console.log(error)
      }
    }
     
    useEffect(() => {
  if (searchedusers ) {
 setdisplay(true)
  }
}, [searchedusers]);



useEffect(() => {
    tl.current = gsap.timeline({ paused: true });

    // dropdown animation
    tl.current.fromTo(
      containerref.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.35, ease: "power3.out" }
    );

   

    // initial hidden state
    gsap.set(containerref.current, { opacity: 0, y: -20 });
  }, []);

  // OPEN animation
  useEffect(() => {
    if (display) {
      tl.current.restart();
    }
  }, [display]);

  // OUTSIDE CLICK → CLOSE animation
  useOutsideClick(containerref, () => {
    if (!display) return;

    gsap.to(containerref.current, {
      y: -20,
      opacity: 0,
      duration: 0.25,
      ease: "power3.in",
      onComplete: () => setdisplay(false),
    });
  });


 return (
    <div className="
    absolute 
    top-1
    z-1
    ">
       

         <form onSubmit={handlesubmit}>
            <div className="
        w-72 md:w-96
        bg-base-200
        rounded-full
        px-4 py-3
        flex items-center gap-3
        shadow-xl
        border border-primary/30
        backdrop-blur-md
        focus-within:ring-2 focus-within:ring-accent
        transition-all duration-300
        hover:scale-[1.03]
      ">
        {/* Search Icon */}
        <svg
          className="w-5 h-5 text-primary"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>

        {/* Input */}

      
        <input
          type="text"
          value={name}
          onChange={(e)=>setname(e.target.value)}
          className="
            flex-1
            bg-transparent
            outline-none
            text-sm
            placeholder:text-base-content/50
          "
        />
       <button type='submit' className='hidden'></button>

        {/* Floating Badge */}
        <span className="
          absolute 
          top-3
          right-4
          text-xs 
          font-semibold
          text-accent
          bg-base-100
          px-3 
          py-1
          rounded-full
          shadow-md
          animate-bounce
        ">
          Get new friends ! 🙌🏻
        </span>

       
      </div>

        </form>
              
          <div
             ref={containerref} 
             style={{ pointerEvents: display ? "auto" : "none" }}
        className="
        px-8
        w-72 md:w-96
        h-full
        bg-base-200
        rounded-3xl
        flex-col
        gap-3
        px-4 py-3
        flex items-start justify-start
        border border-primary/30
        focus-within:ring-2 focus-within:ring-accent
        transition-all duration-300
      ">
          
          {
            searchedusers?.map((user,index)=>(
                   <div 
                  ref={(el) => (itemsref.current[index] = el)}
                   key={user.username}
                   className='flex items-center justify-between    
                     hover:scale-110
                   transition-all duration-300
                   w-full  
                   '>
              <Link to={`/userprofile/${user._id}`} 
              className='no-underline flex items-center'>
                <div className='w-16 h-full '>
                <img className=' w-14 h-14 rounded-full border-2 border-accent object-center' src={user?.profilePic} alt="" />
               </div>

               <div className='h-full pb-3 pl-2'>
                <span className='text-xs font-semibold'>{user.fullName}</span>
               </div>
              </Link>    
            


                 <button onClick={()=>handlesendreqst(user._id)}
                 className={`w-6 h-6 rounded-full hover:scale-90 text-base-100 flex items-center justify-center p-1
                   ${isFriend(user._id)?"bg-red-400":"bg-green-400"}
                 `}>
                <UserPlus/>
                </button>
             
           </div>
            ))
          }

             </div>
                 
            
        
    </div>
  );
}

export default Searchfrineds
