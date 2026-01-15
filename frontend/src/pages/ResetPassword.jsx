import React, { useContext, useState } from 'react'
import logo from '/logo.png'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(0)
  const [newPassword, setNewPassword] = useState('')
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false)

  const {backendUrl} = useContext(AppContext)
  axios.defaults.withCredentials = true;

  const inputRefs = React.useRef([])
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

  const handleEmailSubmit = async (e) => {
    try {
      e.preventDefault();
      const {data} = await axios.post(backendUrl + '/api/auth/send-reset-otp', {email})
      if(data.success){
        toast.success(data.message)
        setIsEmailSent(true)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.success(error.message)
    }
  } 
  const handleOtpSubmit = async (e) => {
      e.preventDefault();
      const otpArray = inputRefs.current.map(e => e.value)
      setOtp(otpArray.join(''))
      setIsOtpSubmitted(true)
  } 
  const handleSubmitNewPassword = async (e) => {
    try {
      e.preventDefault();
      const {data} = await axios.post(backendUrl + '/api/auth/reset-password', {email, otp, newPassword})
      if(data.success){
        toast.success(data.message)
        navigate('/login')
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.success(error.message)
    }
  } 

  return (
    <div className='flex flex-col min-h-screen bg-linear-65 from-green-300/10 to-pink-300/10'>
      <img src={logo} alt="Auth System" onClick={()=> navigate('/')} className='absolute left-4 top-1 h-7'/> 
      {/* form for entering email */}
      {!isEmailSent && 
      <form onSubmit={handleEmailSubmit} className='mt-16 mx-12 bg-white border border-gray-200 px-7 py-5 rounded-lg flex flex-col shadow sm:w-78 sm:mx-auto'>
        <h1 className='font-medium text-xl text-center'>Reset Password</h1>
        <p className='text-sm text-gray-500 text-center'>Enter your registered email address</p>
        <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} placeholder='Enter your email id here' className='text-sm border border-gray-200 px-2 py-1 my-3 rounded-sm outline-none' required/>
        <button className='text-sm bg-blue-500 text-white rounded-sm mt-2 py-1 cursor-pointer'>Submit</button>
      </form>
      }
      
      {/* form for otp input */}
      {isEmailSent && !isOtpSubmitted && 
      <form onSubmit={handleOtpSubmit} className='mt-16 mx-14 bg-white border border-gray-200 px-7 py-5 rounded-lg flex flex-col shadow sm:w-75 sm:mx-auto'>
        <h1 className='font-medium text-xl text-center'>Reset Password OTP</h1>
        <p className='text-sm text-gray-500 text-center'>Enter the 6-digit code sent to your email id</p>
        <div onPaste={handlePaste} className='flex justify-between my-3'>
            {Array(6).fill(0).map((_, index)=> (
              <input ref={e => inputRefs.current[index] = e} type="text" maxLength={1} key={index } className='w-7 h-7 border border-gray-300 rounded-sm text-center text-sm' required
              onInput={(e) => handleInput(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
        </div>
        <button className='text-sm bg-blue-500 text-white rounded-sm mt-2 py-1 cursor-pointer'>Submit</button>
      </form>
      }

      {/* form for entering new password */}
      {isEmailSent && isOtpSubmitted && 
      <form onSubmit={handleSubmitNewPassword} className='mt-16 mx-12 bg-white border border-gray-200 px-7 py-5 rounded-lg flex flex-col shadow sm:w-78 sm:mx-auto'>
        <h1 className='font-medium text-xl text-center'>New Password</h1>
        <p className='text-sm text-gray-500 text-center'>Enter the new password below</p>
        <input type="password" onChange={(e) => setNewPassword(e.target.value)} value={newPassword} placeholder='Enter your new password here' className='text-sm border border-gray-200 px-2 py-1 my-3 rounded-sm outline-none' required/>
        <button className='text-sm bg-blue-500 text-white rounded-sm mt-2 py-1 cursor-pointer'>Submit</button>
      </form>
      }
    </div>
  )
}

export default ResetPassword