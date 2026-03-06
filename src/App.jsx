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
import BrowseRooms from './pages/BrowseRooms'
import ViewStudentDetail from './pages/ViewStudentDetail'
import Bookings from './pages/Bookings'
import Notifications from './pages/Notifications'
import Login from './pages/Login'
import Register from './pages/Register'
import HostelRequestForm from './pages/student/HostelRequestForm'
import MyRequestStatus from './pages/student/MyRequestStatus'
import RequestQueue from './pages/admin/RequestQueue'

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
            <Route path="/browse-rooms" element={<BrowseRooms />} />
            <Route path="/student-request" element={<ProtectedRoute roles={["STUDENT"]}><HostelRequestForm /></ProtectedRoute>} />
            <Route path="/my-requests" element={<ProtectedRoute roles={["STUDENT"]}><MyRequestStatus /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/pending-requests" element={<ProtectedRoute roles={["ADMIN"]}><RequestQueue /></ProtectedRoute>} />

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
