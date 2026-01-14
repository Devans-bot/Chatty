import React from 'react'
import { useState } from 'react'
import { useauthstore } from '../store/useauthstore'
import { Eye, EyeOff, MessageSquare } from 'lucide-react'
import AuthImagePattern from '../components/authimage'
import { Link } from 'react-router-dom'

const Login = () => {
    

    const {logIn}=useauthstore()

    const [formdata,setformdata]=useState({
        email:"",
        password:""
    })
   
    const [showpaswrd,setshowpaswrd] =useState(false)

    const handlesubmit=(e)=>{
        e.preventDefault()
       logIn(formdata)
    }
  return (
   
    <div className='min-h-screen w-screen grid lg:grid-cols-2 '>
        
        <div  className='flex flex-col w-full items-center justify-center h-screen '>
           

            <div className='w-full  h-full max-w-md  flex flex-col items-center justify-center space-y-3'>
             
            <div className='flex flex-col items-center justify-start'>
               <div className='rounded-2xl w-16 h-16 flex items-center justify-center text-center bg-primary/20  transition duration-300 
            hover:-translate-y-2 hover:scale-105'>
             <MessageSquare className="size-9 text-primary " />
             </div>
              
             <div className='flex flex-col items-center mt-5'>
              <h2 className='font-bold'>Welcome back</h2>
              <p className='text-xs'>Sign in to your account</p>
             </div>
            </div>
               

            
               

                 <form onSubmit={handlesubmit} className='w-8/12 space-y-10 pt-20'>


                  <div>
                 
  <div>
              <label className="relative block w-full">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-[1em] opacity-50 pointer-events-none"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </g>
                </svg>

                <input
                  type="email"
                  placeholder="mail@site.com"
                  required
                  value={formdata.email}
                  onChange={(e) => setformdata({ ...formdata, email: e.target.value })}
                  className="input input-bordered w-full rounded-md pl-10 focus:outline-none"
                />
              </label>
              <div className="validator-hint hidden">Enter valid email address</div>
            </div>

            {/* PASSWORD */}
            <div className="relative mt-5 w-full">
              <label className="relative block w-full">
                {/* Left icon */}
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-[1em] opacity-50 pointer-events-none"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                    <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
                  </g>
                </svg>

                <input
                  type={showpaswrd ? "text" : "password"}
                  required
                  placeholder="Password"
                  value={formdata.password}
                  onChange={(e) =>
                    setformdata({ ...formdata, password: e.target.value })
                  }
                  className="input input-bordered w-full rounded-md pl-10 pr-10 focus:outline-none"
                />

                {/* Eye toggle */}
                <button
                  type="button"
                  onClick={() => setshowpaswrd(!showpaswrd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center bg-transparent border-none shadow-none focus:outline-none cursor-pointer p-0"
                >
                  {showpaswrd ? (
                    <EyeOff className="size-5 text-base-content/40 pointer-events-none" />
                  ) : (
                    <Eye className="size-5 text-base-content/40 pointer-events-none" />
                  )}
                </button>
              </label>
            </div>
                  </div>
                  
                  <button type='submit' className='w-full h-14 rounded-xl text-center  bg-primary/90 hover:bg-primary/30 hover:scale-105'>
                      <h3>Submit</h3>
                  </button>
                   </form>

                     <div
            className='
            text-sm flex gap-2 pt-5'
            >
              <p>Don't have a account ? </p>
              <Link to="/signup" >
                Create account
              </Link>
            </div>
            </div>
            
           
        </div>

<AuthImagePattern
title="Join our community"
subtitle="Connect with friends , share moments, and stay in touch"/>
    </div>
  )
}
  
export default Login
