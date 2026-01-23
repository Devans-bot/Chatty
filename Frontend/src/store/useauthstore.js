import {create} from "zustand"
import { axiosinstance } from "./axiosinstance"
import toast from "react-hot-toast"
import {io} from "socket.io-client"
import { generateKeyPair } from "../utils/generatekey"
import { useChatStore } from "./usechatstore"
import { getDeviceId } from "../utils/getdeviceid"
import { generateDeviceKeyPair } from "../utils/devicekey"

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
      
       if (res.data?._id) {
  set({ authUser: res.data });
  await get().registerDevice(); // 🔑 REQUIRED
  get().connectSocket();
}
    } catch (error) {
        console.log(error)
        set({authUser:null})
    }finally{
        set({isCheckingAuth:false})
    }
   },

   registerDevice: async () => {
  const { authUser } = get();
    console.log("REGISTER DEVICE CALLED, user:", authUser?._id);

  if (!authUser?._id) return;

  const deviceId = getDeviceId();
    console.log("DEVICE ID:", deviceId);



  let devicePrivateKey = localStorage.getItem(`devicePrivateKey-${deviceId}`);
  let devicePublicKey = localStorage.getItem(`devicePublicKey-${deviceId}`);

  if (!devicePrivateKey || !devicePublicKey) {
    const keys = await generateDeviceKeyPair();
    devicePrivateKey = keys.privateKey;
    devicePublicKey = keys.publicKey;

    localStorage.setItem(`devicePrivateKey-${deviceId}`, devicePrivateKey);
    localStorage.setItem(`devicePublicKey-${deviceId}`, devicePublicKey);
  }

  const res= await axiosinstance.post("/device/registerdevice", {
    deviceId,
    publicKey: devicePublicKey,
  });
  if (res.data?.message) {
  toast.success(res.data.message);
}
},


signUp: async (data) => {
  set({ isSigningup: true });
  
  try {

    const res = await axiosinstance.post("/user/signup",data);

    const user = res.data.user;
     

    set({ authUser: user });
    await get().registerDevice();

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

    set({ authUser: user });
    await get().registerDevice();

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
      get().disconnectSocket();
    await axiosinstance.post("/user/logout");

    localStorage.removeItem("selectedUser"); // 🔥 ADD
    set({
      authUser: null,
      socket: null,
    });

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
        toast("🐒 Oops… Boop couldn’t find user",{
          duration:1000
        })
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
    if (!authUser?._id) return;
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
