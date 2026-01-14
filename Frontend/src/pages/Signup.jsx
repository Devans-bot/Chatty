import { Eye, EyeOff, MessageSquare } from 'lucide-react'
import React, { useState } from 'react'
import AuthImagePattern from '../components/authimage'
import toast from 'react-hot-toast'
import { useauthstore } from '../store/useauthstore'
import { Link } from 'react-router-dom'

const Signup = () => {
  const { signUp } = useauthstore()
  const [showpaswrd, setshowpaswrd] = useState(false)

  const [formdata, setformdata] = useState({
    fullName: "",
    username:"",
    email: "",
    password: ""
  })

  const validateform = () => {
    if (!formdata.fullName.trim()) return toast.error("Full name is required");
    if (!formdata.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formdata.email)) return toast.error("Invalid email format");
    if (!formdata.password) return toast.error("Password is required");
    if (formdata.password.length < 6) return toast.error("Password must be at least 6 characters");
    return true
  }

  const handlesubmit = (e) => {
    e.preventDefault()
    const success = validateform()
    if (success === true) signUp(formdata)
  }

  return (
    <div className='min-h-screen w-screen grid lg:grid-cols-2 '>
      <div className='flex flex-col w-full items-center justify-center h-screen'>
        <div className='w-full max-w-md flex flex-col items-center justify-start space-y-3'>

          <div className='flex flex-col items-center justify-center'>
            <div className='rounded-2xl w-16 h-16 flex items-center justify-center text-center bg-primary/20 transition duration-300 hover:-translate-y-2 hover:scale-105'>
              <MessageSquare className="size-9 text-primary " />
            </div>

            <div className='mt-5 flex flex-col items-center justify-center'>
              <h3>Create account</h3>
              <h2>Get started with your free account</h2>
            </div>
          </div>

          <form onSubmit={handlesubmit} className='w-8/12  space-y-10'>

            {/* DisplayName */}
            <div className='mt-7'>
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
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </g>
                </svg>

                <input
                  type="text"
                  required
                  placeholder="Display Name"
                  pattern="[A-Za-z][A-Za-z0-9\-]*"
                  minLength="3"
                  maxLength="30"
                  title="Only letters, numbers or dash"
                  value={formdata.fullName}
                  onChange={(e) => setformdata({ ...formdata, fullName: e.target.value })}
                  className="input text-xs font-semibold input-bordered w-full rounded-md pl-10 focus:outline-none"
                />
              </label>
            </div>


            {/* handle */}
            <div className='mt-7'>
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
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </g>
                </svg>

                <input
                  type="text"
                  required
                  placeholder="handle: user_09"
                  minLength="3"
                  maxLength="30"
                  value={formdata.username}
                  onChange={(e) => setformdata({ ...formdata, username: e.target.value })}
                  className="input text-xs font-semibold input-bordered w-full rounded-md pl-10 focus:outline-none"
                />
              </label>
            </div>


            {/* EMAIL */}
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
                  className="input text-xs font-semibold input-bordered w-full rounded-md pl-10 focus:outline-none"
                />
              </label>
              <div className="validator-hint hidden">Enter valid email address</div>
            </div>

            {/* PASSWORD */}
            <div className="relative w-full">
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
                  placeholder="********"
                  value={formdata.password}
                  onChange={(e) =>
                    setformdata({ ...formdata, password: e.target.value })
                  }
                  className="input text-xs font-semibold input-bordered w-full rounded-md pl-10 pr-10 focus:outline-none"
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

            <button
              type='submit'
              className='w-full h-14 rounded-xl text-center bg-primary/90 hover:bg-primary/30 hover:scale-105'
            >
              <h3>Submit</h3>
            </button>
          </form>
        </div>

        <div className='text-sm flex mt-4 gap-2'>
          <p>Already have a account ? </p>
          <Link to="/login">Sign in</Link>
        </div>
      </div>

      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends , share moments, and stay in touch"
      />
    </div>
  )
}

export default Signup
