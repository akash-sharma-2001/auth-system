import React, { useContext, useEffect } from 'react'
import logo from '/logo.png'
import axios from 'axios'
import {toast} from 'react-toastify'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const VerifyEmail = () => {
  const inputRefs = React.useRef([])
  const {backendUrl, isLoggedin , userData, getUserData} = useContext(AppContext)
  const navigate = useNavigate()
  
  const handleInput = async(e, index) => {
    if(e.target.value.length > 0 && index < inputRefs.current.length - 1){
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = async(e, index) => {
    if(e.key === 'Backspace' && e.target.value === "" && index > 0){
      inputRefs.current[index - 1].focus()
    }
  }

  const handlePaste = async (e) => {
    const paste = e.clipboardData.getData('text')
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if(inputRefs.current[index]){
        inputRefs.current[index].value = char;
      }
    })
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map(e => e.value)
      const otp = otpArray.join('')
      const {data} = await axios.post(backendUrl + '/api/auth/verify-email', {otp})
      if(data.success){
        toast.success(data.message)
        getUserData()
        navigate('/')
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=> {
    isLoggedin && userData && userData.isAccountVerified && navigate('/')
  }, [isLoggedin, userData])

  return (
    <div className='flex flex-col items-center bg-blue-50/10 min-h-screen'>
      <img src={logo} alt="Auth System" onClick={()=> navigate('/')} className='absolute left-5 top-2 h-7'/>
      <form onSubmit={handleSubmit} className='mt-16 mx-8 border border-gray-200 px-6 py-4 rounded-lg flex flex-col sm:w-[20%]'>
          <h1 className='font-medium text-xl text-center'>Email Verify Otp</h1>
          <p className='text-sm text-center text-gray-400 mb-2'>Enter the 6-digit code sent to your email id</p>
          <div onPaste={handlePaste} className='flex justify-between gap-1'>
            {Array(6).fill(0).map((_, index)=> (
              <input ref={e => inputRefs.current[index] = e} type="text" maxLength={1} key={index } className='w-7 h-7 border border-gray-400 rounded-sm text-center text-sm' required
              onInput={(e) => handleInput(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>
          <button className='text-sm border border-gray-400 px-2 py-0.5 rounded-lg mt-2'>Submit</button>
      </form>
    </div>
  )
}

export default VerifyEmail