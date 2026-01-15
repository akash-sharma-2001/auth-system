import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'

const Home = () => {
  return (
    <div className='bg-linear-65 from-green-300/10 to-pink-300/10 min-h-screen'>
        <Navbar/>
        <Header/>
    </div>
  )
}

export default Home