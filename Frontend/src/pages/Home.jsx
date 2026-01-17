import React from 'react'
import Sidebar from '../components/sidebar'
import Nochat from '../components/nochat'
import { useChatStore } from '../store/usechatstore'
import Chatcontainer from '../components/chatcontainer'
import { useEffect } from 'react'

const Home = () => {

  const {clearSelectedUser}=useChatStore()

  useEffect(() => {
  clearSelectedUser();
}, []);

  const {selecteduser}=useChatStore()
  return (
   <div className="relative min-h-[100dvh]
 pt-12 md:pt-16 flex justify-center bg-base-200/45">
      <div className='w-screen lg:w-8/12  md:w-11/12 rounded-xl h-5/5 md:mt-2 flex  shadow-cl bg-base-100'>

           <Sidebar/>
           {!selecteduser?<Nochat/>:<Chatcontainer/>}
      </div>
    </div>
  )
}

export default Home
