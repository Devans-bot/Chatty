import React from 'react'
import { THEMES } from '../components/constants'
import { usethemestore } from '../store/usethemestore'
import { useauthstore } from '../store/useauthstore'
import { Send } from 'lucide-react'

const Settings = () => {

  const {theme,setTheme}=usethemestore()

  const {authUser}=useauthstore()

  
  return (

    <div className='w-screen  h-screen flex justify-center'> 

       <div className='md:w-8/12 pt-16 w-11/12 h-full '>
         <div className='flex flex-col items-start justify-start p-3 font-bold'>
          <h2>Theme</h2>
          <h3 className='text-xs'>Choose a theme for your chat interface</h3>
         </div>
        
        <div className='grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2'>
           {THEMES.map((t)=>(
            <button 
            key={t}
            className={`group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors
            ${theme === t ? "bg-base-200":"hover:bg-blue-200/50"}
            `}
            onClick={()=>setTheme(t)}>

              <div className='relative h-8 w-full rounded-md overflow-hidden ' data-theme={t}>
                <div className='absolute inset-0 grid grid-cols-4 gap-px p-1'>
                  <div className='rounded bg-primary'></div>
                  <div className='rounded bg-secondary'></div>
                  <div className='rounded bg-accent'></div>
                  <div className='rounded bg-neutral'></div>
                </div>
              </div>
             <span className='text-[11px] font-medium truncate w-full text-center'>
              {t.charAt(0).toUpperCase()+t.slice(1)}
             </span>
            </button>
           ))}
        </div>

        <div className='w-full flex justify-center bg-base-300 items-center p-4  rounded-lg'>

             <div className=' w-full md:w-9/12  h-80 rounded-xl bg-base-100 border-2 flex flex-col'>
                

                <div className='w-full h-10 mt-2 rounded-lg  flex items-center justify-start gap-3 pl-2'>
                  <div className='rounded-full w-5 h-5 bg-primary/50 p-4 flex items-center justify-center'>
                 <h2>{authUser?.fullName?.charAt(0).toUpperCase()}</h2>
                 </div>
                  <div className='flex flex-col text-xs'>
                    <h3 className='font-bold'> {authUser?.fullName}</h3>
                    <h3>Online</h3>
                  </div>
                </div>

                <div className=' w-full h-52 '>
                     
                     <div className='w-full mt-4 flex items-center justify-start p-2'>
                        <div className=' h-20 text-base-content/70 rounded-lg flex bg-base-200/50 flex-col gap-4 items-start justify-center pl-2 w-8/12 md:w-6/12 h-18 ' >
                          <h3 className='font-semibold text-xs'>Hey ! How it's going ?</h3>
                          <h3 className='text-xs'>12:00 pm</h3>
                        </div>
                     </div>

                   <div className='w-full flex items-center justify-end p-2'>
                        <div className=' h-20 text-base-content/70 rounded-lg flex bg-primary/30   flex-col gap-4 items-start justify-center pl-2 w-8/12 md:w-6/12 h-18 ' >
                          <h3 className='font-semibold text-xs'>I'm doing great just working new features</h3>
                          <h3 className='text-xs'>12:00 pm</h3>
                        </div>
                     </div>
                  
                 </div>


                 <div className="w-full h-px bg-black mt-2"></div>

                <div className='w-full flex items-start justify-between gap-2  p-4'>
                  <div className='text-xs border-2  w-11/12 h-10 rounded-2xl flex items-center justify-start pl-2'>
                    <p>This is a preview</p>
                  </div>
                  <div className='w-3/12 md:w-1/12 bg-primary/60 rounded-full flex items-center justify-center h-10 '>
                     <Send/>
                  </div>
                </div>
             </div>
        </div>

       </div>
    </div>
  )
}

export default Settings
