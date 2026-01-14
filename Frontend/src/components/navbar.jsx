import { Bell, Circle, Cross, LogOut, MessageSquare, Minus, Plus, Settings, User, X, XCircle } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { useauthstore } from '../store/useauthstore'
import { Link } from 'react-router-dom'
import useOutsideClick from './useoutside'
import { useChatStore } from '../store/usechatstore'


const Navbar = () => {

 const {authUser,logOut,userRequests,getRequests,addfrnd,removeRequests}=useauthstore()
  const {users:friends}=useChatStore()
   const{getUsers,clearSelectedUser}=useChatStore()
 const [bellisopen,setbellisopen]=useState(false)
 const bellref=useRef(null)

 useOutsideClick(bellref,()=>setbellisopen(false))


useEffect(()=>{
   getRequests()
},[getRequests])

 useEffect(()=>{
    getUsers()
   },[getUsers])



 

    const isFriend = (id) =>
    friends?.some((friend) => friend._id === id);


const handleaddfrnd=async(id)=>{
 await addfrnd(id)
}
const submithandler=()=>{
    logOut()
}

const handleremove=async()=>{
   await removeRequests()
}

  
  return (
   <header className='w-screen z-50 fixed top-0 bg-base-100 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.2)] '>

       <div className='flex items-center p-1 md:p-3 justify-between'>

            <Link to="/"
            onClick={()=>clearSelectedUser()}
            > 
             <div className='flex items-center gap-2'>        
            <div className='rounded-xl w-9 h-9 flex items-center  justify-center text-center bg-primary/20  transition duration-300 
             hover:scale-105'>          
            <MessageSquare className="size-4 text-primary " />
             </div>
             <h3 className='font-semibold' >Chatty</h3>
             </div>
            </Link>
           

          <div className=' gap-3 items-center  flex'>
            
                         <Link to="/settings" className='no-underline '>

            <div className='flex bg-black/30 text-sm rounded-lg p-2 hover:bg-black/70'>
                <Settings className='size-5'/>
                <p className='hidden md:block'>Settings</p>
            </div>
            </Link>
             
            {authUser && (<>
            <Link to="/profilepage" className='no-underline'>   

             <div className='flex bg-black/30 text-sm rounded-lg p-2 hover:bg-black/70'>
                <User className='size-5'/>
                 <h3 className='hidden md:block'>Profile</h3>
             </div>
              </Link>

           
               <div ref={bellref} className=' flex' >
                  <button className='relative' onClick={()=>
                    setbellisopen(prev=>!prev)
                  }>
               {userRequests.length>0 && 
               (
                <div className='absolute top-0 right-0 w-3 h-3 bg-green-500 text-green-500 rounded-full'>
                  <Circle size={2}/>
                </div>
               )}
               <Bell size={20}/>
             </button>
             {bellisopen && (

              <div  className=' absolute top-10 right-3 w-3/5  md:w-2/6 p-3 flex flex-col items-start justify-center jus rounded-2xl backdrop-blur-lg bg-primary/40 z-50'>
              
              {userRequests.length>0 && (<button onClick={handleremove}>
                <XCircle size={18}/>
              </button>)}
                  {(userRequests.length===0 )&& (
                   <div className='w-full flex p-3 items-center justify-center text-xs font-semibold'>
                     <p>No pending Requests 🙁</p>
                   </div>
                  )}


                  {userRequests?.map((user)=>(
                            <div 
                   key={user._id}
                   className='mt-5 flex items-center justify-between    
                   transition-all duration-300
                   w-full  
                   '>

             <div className='flex items-center'>
                <div className='w-16 h-full '>
                <img className=' w-14 h-14 rounded-full border-2 border-accent object-center' src={user?.profilePic} alt="" />
               </div>

               <div className='h-full pb-3 pl-2'>
                <span className='text-sm   font-semibold'>{user.fullName}</span>
               </div>
               </div>

                 <button onClick={()=>handleaddfrnd(user._id)}
                 className={`w-6 h-6 rounded-full  text-base-100 flex items-center justify-center p-1
                   ${isFriend(user._id)?"bg-red-400":"bg-green-400"}
                 `}>
                  {isFriend(user._id)?<X/>:<Plus/>}

                </button>
             
           </div>
                  ))}
                   
              </div>
             )}
            </div>


             <button
              onClick={submithandler}
              type="button"
              className="
              flex items-center gap-2 text-sm
              bg-transparent p-2 rounded-lg
              hover:bg-black/30
              active:scale-95
              transition-transform duration-150
               focus:outline-none focus:ring-0 active:outline-none
               "
               >           
             <LogOut className='size-5'/>
           
             </button>
            </>)}
          </div>


        

       </div>

   </header>
  )
}

export default Navbar
