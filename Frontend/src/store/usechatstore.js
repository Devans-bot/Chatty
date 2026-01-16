import { create } from "zustand";
import { axiosinstance } from "./axiosinstance";
import { useauthstore } from "./useauthstore";

import { getSharedAESKey } from "../utils/chatkey";
import { decryptWithAES, encryptWithAES } from "../utils/crypto";
import toast from "react-hot-toast";

export const useChatStore=create((set,get)=>({
    messages:[],
    users:[],
    activeChatId:null,
selecteduser: JSON.parse(localStorage.getItem("selectedUser")) || null,
    isUsersloading:false,
    isMessagesloading:false,

    getUsers:async()=>{
        set({isUsersloading:true})
        try {
            const res=await axiosinstance.get("/user/allfrnds")
            set({users:res.data})
        } catch (error) {
            console.log(error)
        }
        finally{
            set({isUsersloading:false})
        }
    },

  getmessages: async (id) => {
     const myId = useauthstore.getState().authUser._id;
     const chatId = [myId, id].sort().join("_");
    

    set({ isMessagesloading: true });

    try {
     
      const res = await axiosinstance.get(`/chat/${chatId}`);
    const decrypted = await Promise.all(
  res.data.map(async (msg) => {
    if (!msg.cipherText) return msg;

    try {
      const aesKey = await getSharedAESKey(myId, id);
      const text = await decryptWithAES(msg, aesKey);
      return { ...msg, text };
    } catch {
      return msg; 
    }
  })
);


 if (get().activeChatId === chatId) {
      set({ messages: decrypted });
    }
    } finally {
      set({ isMessagesloading: false });
    }
  },

  sendmessages: async (text, image, socket) => {

    const { selecteduser, messages,activeChatId } = get();
    const myId = useauthstore.getState().authUser._id;

    if(!selecteduser)return

    const chatId = [myId, selecteduser._id].sort().join("_");

     
 let aesKey;
  try {
    // 🔑 ALWAYS attempt key generation here
    aesKey = await getSharedAESKey(myId, selecteduser._id);
  } catch (err) {
    console.error("AES key error:", err);
    toast.error("Encryption failed. Reload and try again.");
    return; // ⛔ STOP execution
  }

    let encrypted = null;
    if (text?.trim()) {
      encrypted = await encryptWithAES(text, aesKey);
    }

    const payload = {
      ...encrypted,
      image: image || null,
    };

    const saved = await axiosinstance.post(
      `/chat/send/${chatId}`,
      payload
    );

    set({
      messages: [...messages, { ...saved.data, text }],
    });
  },

  
  setselecteduser: (user) => {
  const myId = useauthstore.getState().authUser._id;
  const chatId = [myId, user._id].sort().join("_");

  localStorage.setItem("selectedUser", JSON.stringify(user));

  set({
    selecteduser: user,
    messages: [],
    activeChatId: chatId,
  });
},




  clearSelectedUser: () => {
  localStorage.removeItem("selectedUser");
   set({ selecteduser: null });
   },

     attachSocketListeners: (socket) => {
    if (!socket) return;

    socket.off("friend:update");

    socket.on("friend:update", async () => {
      await get().getUsers();
    });
  },

  }))

