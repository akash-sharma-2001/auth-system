import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'

const Header = () => {
  const {userData} = useContext(AppContext)

  return (
    <div className='flex flex-col items-center text-center mt-7 px-10 sm:px-16 sm:mt-16'>
        <h1 className='text-lg sm:text-2xl'>Hi {userData ? userData.name : 'Guest'}!</h1>
        <h2 className='text-xl font-medium sm:text-3xl'>Welcome to our platform!</h2>
        <p className='text-sm text-gray-600 sm:text-lg'>Sign up today, verify your account, and enjoy a safe and seamless login experience.</p>
        <button className='px-2 py-0.5 border border-gray-400 rounded-2xl mt-3 hover:bg-gray-100 cursor-pointer'>Get Started</button>
    </div>
  )
}

export default Header