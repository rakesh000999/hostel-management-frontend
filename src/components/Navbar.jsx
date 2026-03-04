import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, LogOut } from 'lucide-react'
import AuthContext from '../context/AuthContext'

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const { isAuthenticated, logout } = useContext(AuthContext)

    // If user is authenticated, don't show this navbar (sidebar will be shown instead)
    if (isAuthenticated) {
        return null
    }

    return (
        <nav className="bg-[#0E1524] shadow-black text-white shadow-md w-full sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                <h3 className="text-2xl font-bold tracking-wide">
                    <Link to={"/"}>Hostel Management System</Link>
                </h3>

                {/* Desktop Links */}
                <div className="hidden md:flex gap-8 font-medium items-center">
                    <Link to="/" className="hover:text-[#ff5c00] transition duration-200">
                        Home
                    </Link>
                    <Link to="/register" className="text-gray-300 hover:text-[#ff5c00] transition duration-200">
                        Sign Up
                    </Link>
                    <Link to="/login" className='bg-indigo-600 px-4 py-2 rounded-full hover:bg-indigo-700 transition font-semibold'>
                        Login
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden text-white hover:text-yellow-300 focus:outline-none transition"
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Dropdown Menu */}
            {isOpen && (
                <div className="md:hidden bg-[#1a2332] border-t border-blue-500">
                    <div className="flex flex-col items-center gap-4 py-4 text-lg font-medium">
                        <Link
                            to="/"
                            onClick={() => setIsOpen(false)}
                            className="hover:text-yellow-300 transition"
                        >
                            Home
                        </Link>
                        <Link
                            to="/register"
                            onClick={() => setIsOpen(false)}
                            className="hover:text-yellow-300 transition"
                        >
                            Sign Up
                        </Link>
                        <Link
                            to="/login"
                            onClick={() => setIsOpen(false)}
                            className='bg-indigo-600 px-4 py-2 rounded-full hover:bg-indigo-700 transition w-32 text-center font-semibold'
                        >
                            Login
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar
