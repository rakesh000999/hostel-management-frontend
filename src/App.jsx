import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Students from './pages/students'
import Fees from './pages/Fees'
import Rooms from './pages/Rooms'
import ViewStudentDetail from './pages/ViewStudentDetail'
import Bookings from './pages/Bookings'

function App() {

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/students" element={<Students />} />
          <Route path="/students/:id" element={<ViewStudentDetail />} />
          <Route path="/fees" element={<Fees />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path='/bookings' element={<Bookings />} />
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
