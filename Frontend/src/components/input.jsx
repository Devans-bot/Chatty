import { Cross, Image, Loader, Plus, Send, Smile, X } from 'lucide-react'
import React, { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useChatStore } from '../store/usechatstore'
import { useauthstore } from '../store/useauthstore'
import EmojiPicker from "emoji-picker-react";
import useOutsideClick from './useoutside'


// 🔹 Compress a base64 data URL -> smaller base64 JPEG
const compressDataUrl = (dataUrl, maxWidth = 800, maxHeight = 800, quality = 0.6) => {
  return new Promise((resolve, reject) => {
    if (typeof dataUrl !== 'string') {
      reject(new Error('Invalid data URL'))
      return
    }

    const img = new window.Image()
    img.onload = () => {
      let { width, height } = img

      const ratio = Math.min(maxWidth / width, maxHeight / height, 1)
      width *= ratio
      height *= ratio

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Canvas context not available'))
        return
      }

      ctx.drawImage(img, 0, 0, width, height)

      const compressedBase64 = canvas.toDataURL('image/jpeg', quality)
      resolve(compressedBase64)
    }

    img.onerror = () => reject(new Error('Image load error'))
    img.src = dataUrl
  })
}

const Inputbox = () => {
  const { sendmessages ,selecteduser,setSendLoad} = useChatStore()
  const [text, settext] = useState("")
  const [imagepreview, setimagepreview] = useState(null)   // for UI only
  const [rawImage, setRawImage] = useState(null)           // original base64 for compression
  const [imagesending, setimagesending] = useState(false)
  const fileInputRef = useRef(null)
  const {socket}=useauthstore()
 const [showEmoji, setShowEmoji] = useState(false);
  const emojiref=useRef()
  const isMobile = window.innerWidth < 640;

  useOutsideClick(emojiref,()=>setShowEmoji(false))
  // 🔹 Simple, reliable preview (like your original code)
  const handleimagechange = (e) => { 
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image")
      if (fileInputRef.current) fileInputRef.current.value = ""
      return
    }


    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result
      setimagepreview(base64)   // show in UI
      setRawImage(base64)       // keep original to compress later
    }
    reader.readAsDataURL(file)
  }

  const handleremove = () => {
    setimagepreview(null)
    setRawImage(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handlesubmit = async (e) => {
    e.preventDefault()
    
    if (!text.trim() && !rawImage) return
    setSendLoad(true)
    try {
      setimagesending(true)
      setimagepreview(null)

      let imageToSend = null

      if (rawImage ){
        try {
          imageToSend = await compressDataUrl(rawImage, 800, 800, 0.6)
        } catch (err) {
          console.error('Compression failed, sending original image', err)
          imageToSend = rawImage  // fallback so message still sends
        }
      }

     await sendmessages(
  text,
  imageToSend,
   socket
);
      setimagesending(false)
      settext("")
      setimagepreview(null)
      setRawImage(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
    } catch (error) {
      console.error("error sending messages", error)
      setimagesending(false)
    }
  }

  return (
    <div className='border-2 border-primary/10 rounded-t-xl px-2 w-full py-3 flex flex-col gap-1 justify-start'>

      {imagepreview && (
        <div className='h-16 w-16 flex items-center justify-center relative'>
          <img src={imagepreview} className='rounded-md h-14 w-14 object-cover' alt="" />
          <button
            type="button"
            onClick={handleremove}
            className='
transition-all duration-200 ease-out
 active:scale-95
 active:translate-y-0 
 md:hover:bg-primary/40
           absolute top-0 right-0 h-5 w-5 flex items-center justify-center rounded-full bg-gray-200'
          >
            <X size={14} />
          </button>
        </div>
      )}

      { imagesending  && rawImage &&(
        <div className='h-16 w-16 flex items-center justify-center relative'>
          <Loader className="size-5 animate-spin" />
        </div>
      )}

      <form onSubmit={handlesubmit} className='w-full flex items-center'>
        <div className='w-full flex items-center justify-evenly gap-1'>
           
          <input
            type='file'
            accept='image/*'
            ref={fileInputRef}
            className='hidden'
            onChange={handleimagechange}
          />

          <button
            type='button'
            className={`
              transition-all duration-200 ease-out
 active:scale-95
 active:translate-y-0 
 md:hover:bg-primary/40
              w-9 h-9 rounded-full bg-primary/70 flex items-center justify-center ${
              imagepreview ? 'text-green-600' : 'text-base-content'
            }`}
            onClick={() => fileInputRef?.current?.click()}
          >
            <Image size={20} />
          </button>
           

           <div className='w-9/12 relative'>
           <button
            type="button"
            onClick={() => setShowEmoji(v => !v)}
            className={`
            transition-all duration-200 ease-out
 active:scale-95
 md:hover:bg-primary/40
            absolute right-3 top-1/2 -translate-y-1/2  w-8 h-8 rounded-full  flex items-center justify-center text-base-content`}             >
            <Smile/>
            </button>

       
          <input
          autoComplete="off"
         autoCorrect="off"
          spellCheck={false}
           inputMode="text"
            value={text}
            type="text"
            onChange={(e)=>settext(e.target.value)}
            placeholder="Chat"
            className="input input-bordered focus:outline-none w-full rounded-xl"
          />
           </div>
         
          
          <button
            type='submit'
            className={`
              transition-all duration-200 ease-out
 active:scale-95
 active:translate-y-0 
 md:hover:bg-primary/40 w-12 h-10 rounded-full bg-primary/70 flex items-center justify-center ${
              imagepreview || text ? 'text-green-600' : 'text-base-content'
            }`}
          >
            <Send size={20}/>
          </button>
          {showEmoji && (
        <div ref={emojiref} 
         className="
      absolute bottom-20 right-2
      rounded-xl
      backdrop-blur-md
      bg-primary/30
      border-none
      rounded-2xl
      p-1
    "
      >
          <EmojiPicker
           searchDisabled={true}
           previewConfig={{showPreview:false}}
           width={isMobile ? 290 : 340}
          height={isMobile ? 380 : 440}
          emojiSize={isMobile ? 40 : 34}
            onEmojiClick={(emoji) =>
              settext(prev => prev + emoji.emoji)
            }
          />
        </div>
      )}
        </div>
      </form>
    </div>
  )
}

export default Inputbox
