import { ChartBar, Loader, X, Download } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import Chatbar from './chatbar'
import Inputbox from './input'
import { useChatStore } from '../store/usechatstore'
import { useauthstore } from '../store/useauthstore'
import { getSharedAESKey } from '../utils/chatkey'
import { getEmojiType, splitTextAndEmojis } from './emojis'
import MonkeyLoader from './monkeyloader'
import { formatTime } from './formattme'
import { decryptWithAES } from '../utils/crypto'


const Chatcontainer = () => {
  const { messages, selecteduser, getmessages, isMessagesloading,setSendLoad,sendLoad,text,pendingText } = useChatStore()
  const { authUser ,socket} = useauthstore()
  const messagesContainerRef = useRef(null)
  const [previewImage, setPreviewImage] = useState(null)

  
 

  const scrollToBottom = () => {
    const el = messagesContainerRef.current
    if (!el) return

    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight
    })
  }

  useEffect(() => {
       scrollToBottom()
  }, [messages.length,sendLoad])



useEffect(() => {
  getmessages(selecteduser._id);
}, [selecteduser?._id]);


useEffect(() => {
  if (!socket || !authUser || !selecteduser) return;

  const handleReceiveMessage = async (msg) => {
    if (!msg || !msg.senderId || !msg.chatId) return;

    // ✅ ensure message belongs to currently open chat
    const currentChatId = [authUser._id, selecteduser._id]
      .sort()
      .join("_");

    if (msg.chatId !== currentChatId) return;

    let finalMessage = msg;

    // 🔐 decrypt only if needed
    if (msg.cipherText && !msg.text) {
      try {
        const otherUserId =
          msg.senderId === authUser._id
            ? msg.receiverId
            : msg.senderId;

        const chatId = [authUser._id, otherUserId]
          .sort()
          .join("_");

        const aesKey = await getSharedAESKey(chatId);
        const text = await decryptWithAES(msg, aesKey);

        finalMessage = { ...msg, text };
      } catch (err) {
        console.error("Realtime decrypt failed:", err);
        // ❗ keep encrypted message instead of dropping it
      }
    }

    useChatStore.setState((state) => ({
      messages: [...state.messages, finalMessage],
    }));
  };

  socket.on("receiveMessage", handleReceiveMessage);
  return () => socket.off("receiveMessage", handleReceiveMessage);
}, [socket, authUser?._id, selecteduser?._id]);



  if (isMessagesloading)
    return (
      <div className="flex w-full items-center justify-center h-screen">
     <MonkeyLoader text={"Chats are Loading.."} size={"text-5xl"}/>
      </div>
    )

  const handleClosePreview = () => setPreviewImage(null)

  
  const downloadImage = async (url) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;

    // file name
    link.download = "chat-image.jpg";

    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Download failed:", error);
    alert("Failed to download image");
  }
}



  return (
    <>
      <div className="w-screen lg:w-8/12 md:w-9/12 flex flex-col relative h-full">
        <Chatbar />

        <div
          ref={messagesContainerRef}
          className="flex-1 min-h-0 font-semibold bg-base-100 overflow-y-auto "
        >
          {messages.map((message) => {
              const emojiType = getEmojiType(message.text)

              return (

                 
            
            <div
              key={message._id}
              className={`chat  px-2 ${
                message.senderId === authUser._id ? 'chat-end' : 'chat-start '
              }`}
            >
              {/* Profile pic */}
              <div className=" hidden md:block chat-image avatar">
                <div 
                className={`border-2 size-6 md:size-10 rounded-full 
                    `}>
                  <img
                    src={
                      message.senderId === authUser._id
                        ? authUser.profilePic || '/avatar.png'
                        : selecteduser.profilePic || '/avatar.png'
                    }
                    alt="profile pic"
                  />
                </div>
              </div>

              <div className="chat-header mb-1"></div>

              {/* Chat bubble */}
              <div
                className={`chat-bubble
                  p-2
                  text-sm
                  sm:p-2
                  sm:text-sm
                  flex flex-col items-center justify-center 
                  ${
                    message.senderId === authUser._id
                      ? 'bg-primary/30 text-base-content/70'
                      : 'bg-base-200/90 text-base-content/70'
                  }
                `}
              >
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="lg:w-60 w-56 rounded-md mb-3 cursor-pointer"
                    onClick={() => setPreviewImage(message.image)} // 🔹 open preview
                  />
                )}
               {message.text && (
            <p className="text-md w-full md:text-xs leading-[1.4] break-words">
           {splitTextAndEmojis(message.text).map((part, i) =>
             /\p{Extended_Pictographic}/u.test(part) ? (
             <span
                key={i}
               className="inline-block text-3xl align-middle mx-[1px]"
             >
               {part}
              </span>
             ) : (
              <span key={i}>{part}</span>
            )
          )}
              </p>
           )}
            
           <span className="text-[8px] pt-2 opacity-50 self-end leading-none">
            {formatTime(message.createdAt)}
            </span>
                </div>
           </div>
               
              )
           
          })}
          {sendLoad && (
  <div className="chat chat-end pr-2 ">
    <div className="text-base-content/70 px-2 pb-6 font-semibold chat-bubble text-sm bg-primary/30 flex items-start justify-start">
    <p>{pendingText || "....."}</p>
    </div>
  </div>
)}        
        </div>
        <Inputbox />
      </div>

      {/* 🔹 Full-screen image preview overlay */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
          onClick={handleClosePreview} // click outside to close
        >
          <div
            className="relative max-w-4xl w-full px-4"
            onClick={(e) => e.stopPropagation()} // prevent close when clicking image / buttons
          >
            <img
              src={previewImage}
              alt="Full preview"
              className="w-full max-h-[80vh] object-contain rounded-lg"
            />

            {/* Close button */}
            <button
              onClick={handleClosePreview}
              className="
               transition-all duration-200 ease-out
               active:scale-95
               active:translate-y-0 
              md:hover:bg-primary/40
              absolute top-3 right-3 rounded-full bg-black/70 p-2 text-white hover:bg-black/90"
            >
              <X size={18} />
            </button>

            {/* Download button */}
           <button
  onClick={() => downloadImage(previewImage)}
  className=" 
   transition-all duration-200 ease-out
               active:scale-95
               active:translate-y-0 
              md:hover:bg-primary/40
  absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-gray-900 hover:bg-white"
>
  <Download size={16} />
  Download
</button>

          </div>
        </div>
      )}
    </>
  )
}

export default Chatcontainer
