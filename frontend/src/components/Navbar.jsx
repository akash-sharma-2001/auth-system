import React, { useContext, useState } from 'react'
import {useNavigate} from 'react-router-dom'
import logo from '/logo.png'
import { AppContext } from '../context/AppContext';
import axios from 'axios'
import {toast} from 'react-toastify'

const Navbar = () => {
    const navigate = useNavigate();
    const {userData, setUserData, backendUrl, setIsloggedin} = useContext(AppContext)
    const [open, setOpen] = useState(false)

    const logout = async () => {
      try {
        axios.defaults.withCredentials = true
        const {data} = await axios.post(backendUrl + '/api/auth/logout')
        if(data.success){
          setIsloggedin(false)
          setUserData(false)
          navigate('/')
        }
      } catch (error) {
        toast.error(error.message)
      }
    }

    const sendVerificationOtp = async () => {
      try {
        axios.defaults.withCredentials = true;
        const {data} = await axios.post(backendUrl + '/api/auth/send-verification-otp')
        if(data.success){
          navigate('/verify-email')
          toast.success(data.message)
        }else{
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message)
      }
    }

  return (
    <div className='w-full px-4 py-2 flex justify-between items-center sm:py-3 sm:px-10'>
        <img src={logo} alt="Auth System" className='h-7 cursor-pointer'/>
        {userData ?
        (<div onClick={() => setOpen(!open)} className='w-7 h-7 flex justify-center items-center rounded-full text-white bg-blue-500 cursor-pointer relative group'>
          {userData.name[0].toUpperCase()}
          <div className={`absolute group-hover:block text-black right-0 top-0 z-10 pt-8 w-28 ${open ? 'block' : 'hidden'}`}>
            <ul className='list-none text-sm border border-gray-300 rounded-sm'>
              {!userData.isAccountVerified && <li onClick={sendVerificationOtp} className='px-2 py-1 hover:bg-gray-50 cursor-pointer border-b border-gray-300'>Verify Email</li>
              }
              <li onClick={logout} className='px-2 py-1 hover:bg-gray-50 rounded-sm cursor-pointer'>Logout</li>
            </ul>
          </div>
        </div>)
        :
        (<button onClick={()=> navigate('/login')} className='px-3 border border-gray-400 rounded-xl sm:text-lg cursor-pointer'>Login</button>)
        }
    </div>
  )
}

export default Navbar