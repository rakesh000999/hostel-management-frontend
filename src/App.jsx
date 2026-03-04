import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar'
import DashboardLayout from './components/DashboardLayout'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Students from './pages/Students'
import Fees from './pages/Fees'
import Rooms from './pages/Rooms'
import ViewStudentDetail from './pages/ViewStudentDetail'
import Bookings from './pages/Bookings'
import StudentRequest from './pages/StudentRequest'
import MyRequests from './pages/MyRequests'
import Notifications from './pages/Notifications'
import PendingRequests from './pages/PendingRequests'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <DashboardLayout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path='/bookings' element={<Bookings />} />
            <Route path="/student-request" element={<ProtectedRoute roles={["STUDENT"]}><StudentRequest /></ProtectedRoute>} />
            <Route path="/my-requests" element={<ProtectedRoute roles={["STUDENT"]}><MyRequests /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/pending-requests" element={<ProtectedRoute roles={["ADMIN"]}><PendingRequests /></ProtectedRoute>} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute roles={["ADMIN"]}><Dashboard /></ProtectedRoute>} />
            <Route path="/students" element={<ProtectedRoute roles={["ADMIN"]}><Students /></ProtectedRoute>} />
            <Route path="/students/:id" element={<ProtectedRoute roles={["ADMIN"]}><ViewStudentDetail /></ProtectedRoute>} />
            <Route path="/fees" element={<ProtectedRoute roles={["ADMIN"]}><Fees /></ProtectedRoute>} />
            <Route path="/rooms" element={<ProtectedRoute roles={["ADMIN"]}><Rooms /></ProtectedRoute>} />
          </Routes>
        </DashboardLayout>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
