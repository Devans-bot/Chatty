import {create} from "zustand"
import { axiosinstance } from "./axiosinstance"
import toast from "react-hot-toast"
import {io} from "socket.io-client"
import { generateKeyPair } from "../utils/generatekey"
import { useChatStore } from "./usechatstore"

const BASE_URL = window.location.origin

export const useauthstore=create((set,get)=>({
   authUser:null,
   isSigningup:null,
   isLoggingIn:null,
   isUpdatingProfile:null,
   isCheckingAuth:true,
   socket:null,
   thisuser:null,
   searchedusers:null,
   issearching:false,
   userRequests:[],
   onlineUsers:[],

   checkAuth:async()=>{
    try {
        const res=await axiosinstance.get("/user/checkauth")
        set({authUser:res.data})
        get().connectSocket()
    } catch (error) {
        console.log(error)
        set({authUser:null})
    }finally{
        set({isCheckingAuth:false})
    }
   },

signUp: async (data) => {
  set({ isSigningup: true });

  try {
    // 1️⃣ Generate keypair for THIS user
    const { publicKey, privateKey } = await generateKeyPair();

    // 2️⃣ Signup API (send public key to backend)
    const res = await axiosinstance.post("/user/signup", {
      ...data,
      publicKey,
    });

    const user = res.data.user;

    // 3️⃣ Save auth user
    set({ authUser: user });

    // 4️⃣ 🔐 Store PRIVATE KEY locally (user-scoped)
    localStorage.setItem(`privateKey-${user._id}`, privateKey);

    // 5️⃣ Connect socket AFTER keys exist
    get().connectSocket();

    toast.success("Account created successfully");

  } catch (error) {
    console.error(error);
    toast.error(
      error?.response?.data?.message || "Signup failed"
    );
  } finally {
    set({ isSigningup: false });
  }
},



logIn: async (data) => {
  set({ isLoggingIn: true });

  try {
    // 1️⃣ Login API
    const res = await axiosinstance.post("/user/login", data);

    const user = res.data.user;

    // 2️⃣ Set auth user FIRST
    set({ authUser: user });

    // 3️⃣ 🔐 Ensure E2EE keys exist FOR THIS USER

    // 4️⃣ Connect socket AFTER auth + keys
    get().connectSocket();

    toast.success("Logged in successfully");

  } catch (error) {
    console.error(error);
    toast.error(
      error?.response?.data?.message || "Login failed"
    );
  } finally {
    set({ isLoggingIn: false });
  }
},


logOut: async () => {
  try {
    await axiosinstance.post("/user/logout");

    localStorage.removeItem("selectedUser"); // 🔥 ADD
    set({
      authUser: null,
      socket: null,
    });

    get().disconnectSocket();
    toast.success("logged out");
  } catch (error) {
    console.log(error);
  }
},

   
   searchfrnd:async(data)=>{
   set({issearching:true})
    try {
        console.log(data)
        const res=await axiosinstance.post("/user/searchuser",{username:data})
        set({searchedusers:res.data})
    } catch (error) {
        console.log(error)
        toast.error("user not found")
    }finally{
        set({issearching:false})
    }
   },

   addfrnd:async(data)=>{
    try {
        const res=await axiosinstance.get(`/user/addfriend/${data}`)
        toast(res.data.message)
    } catch (error) {
        console.log(error)
    }
   },


   updateProfile:async(data)=>{
    set({isUpdatingProfile:true})
    try {
        const res=await axiosinstance.post("/user/profilepic",data)
        set({authUser:res.data})
        toast.success("Profile updated 😄")
    } catch (error) {
        console.log(error)
    }finally{
        set({isUpdatingProfile:false})
    }
   },


    getUserProfile:async(data)=>{
        try {
            const res=await axiosinstance.get(`/user/userprofile/${data}`)
            set({thisuser:res.data})
        } catch (error) {
            console.log(error)
        }
    },

    getRequests:async()=>{
      try {
        const res=await axiosinstance.get("/user/requests")
        set({userRequests:res.data})
      } catch (error) {
        console.log(error)
      }
    },

    sendrequest:async(data)=>{
      try {
        const res=await axiosinstance.get(`/user/sendrequest/${data}`)
        toast(res.data.message,{
          duration:1000 
        })
      } catch (error) {
        console.log(error)
      }
    },

    removeRequests:async()=>{
      try {
        const res= await axiosinstance.get("/user/removeRequests")
        set({userRequests:[]})
        toast.success(res.data.message)
      } catch (error) {
        console.log(error)
      }
    },

   connectSocket:()=>{
    const {authUser}=get()
    if(!authUser || get().socket?.connected) return;

    const socket=io(BASE_URL,{
      autoConnect: false,      
      auth: { userId: authUser._id }
    })
   

    socket.on("getOnlineUsers",(userIds)=>{
        set({onlineUsers:userIds})
        console.log(userIds)
    })


socket.off("friendRequest:new");

  // 🔔 REAL-TIME FRIEND REQUEST
  socket.on("friendRequest:new", ({ from }) => {
    set((state) => ({
      userRequests: [...state.userRequests, from],
    }));
  });

    useChatStore.getState().attachSocketListeners(socket);

    socket.connect()

    set({socket:socket})
   },

  

   disconnectSocket:()=>{
     if(get().socket?.connected) get().socket.disconnect()
   },
}))
