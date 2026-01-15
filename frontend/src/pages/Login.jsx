import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import logo from '/logo.png'
import { AppContext } from '../context/AppContext';
import axios from 'axios'
import {toast} from 'react-toastify'

const Login = () => {
  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()
  const {backendUrl, setIsloggedin, getUserData} = useContext(AppContext)

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true;
      console.log(backendUrl)
      if(state === "Sign Up"){
        const {data} = await axios.post(backendUrl + '/api/auth/register', {name, email, password});
        if(data.success){
          setIsloggedin(true)
          getUserData()
          navigate('/')
        }else{
          toast.error(data.message)
        }
      }
      else{
        const {data} = await axios.post(backendUrl + '/api/auth/login', {email, password})
        if(data.success){
          setIsloggedin(true)
          getUserData()
          navigate('/')
        }else{
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className='flex flex-col min-h-screen bg-linear-65 from-green-300/10 to-pink-300/10'>
      <img src={logo} alt="Auth System" onClick={()=> navigate('/')} className='h-7 absolute left-4 top-1'/>
      <div className='mt-16 mx-12 bg-white border border-gray-200 px-7 py-5 rounded-lg flex flex-col shadow sm:w-78 sm:mx-auto'>
        <h1 className='font-medium text-xl text-center'>{state === "Sign Up" ? 'Create Account' : 'Login'}</h1>
        <p className='text-sm text-gray-500 text-center'>{state === "Sign Up" ? 'Create your create' : 'Login to your Account'}</p>
        <form onSubmit={handleSubmit} className='flex flex-col gap-1'>
          {state === "Sign Up" && (          
          <div className='flex flex-col mt-1'>
            <label className='font-medium'>Name</label>
            <input type="text" onChange={(e) => setName(e.target.value)} value={name} className='text-sm border border-gray-200 px-2 py-0.5 rounded-sm outline-none' placeholder='Enter your name here' required/>
          </div>
          )}
          <div className='flex flex-col mt-1'>
            <label className='font-medium'>Email</label>
            <input type='email' onChange={(e) => setEmail(e.target.value)} value={email} className='text-sm border border-gray-200 px-2 py-0.5 rounded-sm outline-none' placeholder='Enter your email here' required/>
          </div>
          <div className='flex flex-col mt-1'>
            <label className='font-medium'>Password</label>
            <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} className='text-sm border border-gray-200 px-2 py-0.5 rounded-sm outline-none' placeholder='Enter your password here' required/>
          </div>
          <p onClick={()=> navigate('/reset-password')} className='cursor-pointer text-gray-600 mt-0.5 text-sm'>forgot password</p>
          <button type='submit' className='text-sm bg-blue-500 text-white rounded-sm mt-2 py-0.5 cursor-pointer'>{state==="Sign Up" ? 'Sign Up' : 'Login'}</button>
        </form>
        {state === "Sign Up" ? (
        <p className='text-sm mt-0.5 text-center'>Already have an account? {' '}
          <span onClick={()=> setState("Login")} className='text-blue underline cursor-pointer'>Login here</span>
        </p>
        )
        : (
        <p className='text-sm mt-0.5 text-center'>Don't have an account? {' '}
          <span onClick={()=> setState("Sign Up")} className='text-blue underline cursor-pointer'>Sign Up</span>
        </p>
        )}
      </div>
    </div>
  )
}

export default Login