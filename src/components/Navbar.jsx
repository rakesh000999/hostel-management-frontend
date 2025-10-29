import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className="bg-blue-600 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                <h3 className="text-2xl font-bold tracking-wide">
                    <Link to={"/"}>Hostel Management System</Link>
                </h3>

                {/* Desktop Links */}
                <div className="hidden md:flex gap-8 font-medium">
                    <Link to="/" className="hover:text-yellow-300 transition duration-200">
                        Home
                    </Link>
                    <Link to="/students" className="hover:text-yellow-300 transition duration-200">
                        Students
                    </Link>
                    <Link to="/rooms" className="hover:text-yellow-300 transition duration-200">
                        Rooms
                    </Link>
                    <Link to="/fees" className="hover:text-yellow-300 transition duration-200">
                        Fees
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
                <div className="md:hidden bg-blue-700 border-t border-blue-500">
                    <div className="flex flex-col items-center gap-4 py-4 text-lg font-medium">
                        <Link
                            to="/"
                            onClick={() => setIsOpen(false)}
                            className="hover:text-yellow-300 transition"
                        >
                            Home
                        </Link>
                        <Link
                            to="/students"
                            onClick={() => setIsOpen(false)}
                            className="hover:text-yellow-300 transition"
                        >
                            Students
                        </Link>
                        <Link
                            to="/rooms"
                            onClick={() => setIsOpen(false)}
                            className="hover:text-yellow-300 transition"
                        >
                            Rooms
                        </Link>
                        <Link
                            to="/fees"
                            onClick={() => setIsOpen(false)}
                            className="hover:text-yellow-300 transition"
                        >
                            Fees
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar
