import React, { useEffect, useRef, useState } from "react"
import Sideskeleton from "../skeletons/sidebar"
import { useChatStore } from "../store/usechatstore"
import { ChevronRight, Circle, Dot, Loader, Users } from "lucide-react"
import gsap from "gsap"
import useOutsideClick from "./useoutside"
import { useauthstore } from "../store/useauthstore"

const Sidebar = () => {
  const { getUsers, users, isUsersloading, selecteduser, setselecteduser } =
    useChatStore()

  const {onlineUsers}=useauthstore()

  const [isopen, setisopen] = useState(false)
  const [showOnlineOnly,setShowOnlineOnly]=useState(false)
  const panelRef = useRef(null)

  useEffect(() => {
    getUsers()
  }, [getUsers])


  useOutsideClick(panelRef,()=>{if(isopen) setisopen(false)})


  // GSAP slide in/out
  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return

    if (isopen) {
      gsap.to(panel, {
        x: 0,
        duration: 0.3,
        ease: "power2.out",
      })
    } else {
      gsap.to(panel, {
        x: "-100%",
        duration: 0.25,
        ease: "power2.in",
      })
    }
  }, [isopen])


  const visibleUsers= showOnlineOnly ? users.filter((u)=>onlineUsers.includes(u._id)) :users
  

  const handlechange=()=>{
    setShowOnlineOnly((prev)=>!prev)
  }
  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <div className="overflow-y-hidden overflow-x-hidden bg-primary/20 hidden md:flex flex-col items-start rounded-xl w-2/12 lg:w-4/12 md:w-3/12">
        <div className=" flex text-xs pl-3 pt-3 flex-col gap-4">
        
         <div className="flex gap-3">
           <Users />
          <span className="text-sm font-semibold">contacts</span>
         </div>

      <label
  className="flex gap-2 cursor-pointer items-center"
>
  <input
    type="checkbox"
     onChange={handlechange}
    className="
      appearance-none
      w-5 h-4
      rounded-md
      bg-base-200
      border border-gray-500
      checked:bg-accent
      checked:border-accent
      transition-all duration-200
    "
  />
  <p>Show online Frnds 😮‍💨</p>
     </label>

         
        </div>

        <div className="w-full flex flex-col items-center pt-5 gap-2">
          {visibleUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => {
                if (selecteduser?._id === user._id) {
                  setselecteduser(null)
                } else {
                  setselecteduser(user)
                }
              }}
              className={`
                pt-2 pb-2 md:pl-3
                border-base-300/70
                flex w-full
                md:justify-start justify-center
                transition-all duration-300 ease-out
                items-center gap-5
                ${
                  selecteduser?._id === user._id
                    ? "bg-secondary/30"
                    : "lg:hover:scale-110 lg:hover:pl-9"
                }
              `}
            >
              <div className=" relative w-14 h-14 lg:w-16 lg:h-16">
                <img
                  src={user.profilePic}
                  className="w-full h-full object-center rounded-full border-2 border-neutral"
                  alt=""
                />
                 <div className={` absolute top-0 right-1 h-4 w-4  rounded-full 
                    ${onlineUsers.includes(user._id)?"bg-green-500 text-green-500":"text-gray-400 bg-gray-400"}
                    `}></div>
              </div>
              <div className="hidden md:flex flex-col items-start justify-center">
                <span>{user.fullName}</span>
                {onlineUsers.includes(user._id)?<p className="text-xs">Online</p>:<p className="text-xs">Offline</p>}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* MOBILE SIDEBAR + TOGGLER */}
      <div
        className={`absolute md:hidden z-50 top-0 left-0 h-full
          ${isopen ? "pointer-events-auto" : "pointer-events-none"}
        `}
      >
        {/* toggle button – always clickable */}
        <button
          className="w-4 h-16 bg-base-300 rounded-r-xl flex items-center justify-start pointer-events-auto mt-16"
          onClick={() => setisopen((prev) => !prev)}
        >
          <ChevronRight />
        </button>

        {/* sliding panel – always mounted, start off-screen */}
        <div
          ref={panelRef}
      className="
      absolute mt-16  
      w-36 
      h-2/4
      bg-primary/40 backdrop-blur-md
      flex flex-col
      items-start
      rounded-r-2xl
      translate-x-[-100%]
    "        >
          <div className="w-full text-xs md:text-lg p-1 pl-2 flex flex-col gap-4">
             <div className="flex gap-2 items-center justify-start">
                 <Users size={15} />
            <span className="">contacts</span> 
             </div>
             <div>
             <label
  className="flex gap-2 cursor-pointer items-center"
>
  <input
    type="checkbox"
    checked={showOnlineOnly}
     onChange={handlechange}
    className="
      appearance-none
      w-5 h-4
      rounded-md
      bg-base-200
      border border-gray-500
      checked:bg-accent
      checked:border-accent
      transition-all duration-200
    "
  />
  <p>Online Friends</p>
     </label>
          </div>
          </div>

          <div className="w-full flex fle-1 mt-5 pb-5 overflow-y-auto mb-5 hide-scrollbar
          flex-col items-center gap-4">
            {visibleUsers.map((user) => (
              <button
                key={user._id}
                onClick={() => {
                  if (selecteduser?._id === user._id) {
                    setselecteduser(null)
                  } else {
                    setselecteduser(user)
                  }
                  setisopen(false)
                }}
                className="pt-2 pb-2 p-3 flex w-full justify-start items-center gap-2"
              >
                <div className="w-14 relative h-14 lg:w-16 lg:h-16">
                  <img
                    src={user.profilePic}
                    className={`w-full h-full object-center  rounded-full border-2 border-neutral ${
                      selecteduser?._id === user._id
                        ? "border-base-100 scale-125"
                        : ""
                    }`}
                    alt=""
                  />
                  <div className={` absolute top-0 right-1 h-4 w-4  rounded-full 
                    ${onlineUsers.includes(user._id)?"bg-green-500 text-green-500":"text-gray-400 bg-gray-400"}
                    `}>
                    <Circle className="  size-4" />
                  </div>
                </div>
                <div className="flex  flex-col items-start justify-center">
                  <span className="font-semibold">{user.fullName}</span>
                 {onlineUsers.includes(user._id)? <p className="text-xs">Online</p>: <p className="text-xs">Offline</p>}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
