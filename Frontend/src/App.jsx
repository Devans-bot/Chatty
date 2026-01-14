import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Settings from './pages/Settings'
import Navbar from './components/navbar'
import { useauthstore } from './store/useauthstore'
import { useEffect } from 'react'
import { Loader } from 'lucide-react'
import Profilepage from './pages/Profilepage'
import { Toaster } from 'react-hot-toast'
import { usethemestore } from './store/usethemestore'
import Userprofile from './pages/Userprofile'

const App = () => {

  const {authUser,checkAuth,isCheckingAuth,onlineUsers}=useauthstore()


  const {theme}=usethemestore()

 

  useEffect(()=>{
    checkAuth()
  },[checkAuth])

  



  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme]);


  if(isCheckingAuth && !authUser){
    return(
      <div className="flex items-center justify-center h-screen">
          <Loader className="size-10 animate-spin" />
      </div>
    )
  }
   
  return (
   <div className='overflow-y-hidden bg-base-100 text-base-content' >
    <Navbar/>
    <Routes>
            <Route path='/' element={authUser ? <Home/>:<Navigate to="/login"/>}/>
            <Route path='/login' element={!authUser ? <Login/> : <Navigate to="/"/> }/>
            <Route path='/signup' element={!authUser ? <Signup/> : <Navigate to="/"/> }/>
            <Route path='/settings' element={authUser ? <Settings/> :<Navigate to="/login" />}/>
            <Route path='/profilepage' element={authUser ? <Profilepage/> :<Navigate to="/login" />}/>
            <Route path='/userprofile/:id' element={authUser ? <Userprofile/> :<Navigate to="/login" />}/>


    </Routes>
    <Toaster/>
   </div>
  )
}

export default App
