import React, { useContext, useState } from 'react'
import { Menu } from 'lucide-react'
import Sidebar from './Sidebar'
import AuthContext from '../context/AuthContext'

const DashboardLayout = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    if (!isAuthenticated) {
        return <>{children}</>
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <main className="flex-1 min-w-0">
                <div className="lg:hidden sticky top-0 z-20 bg-white border-b border-gray-200 p-3">
                    <button
                        type="button"
                        onClick={() => setIsSidebarOpen(true)}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-[#0E1524] text-white"
                    >
                        <Menu size={18} />
                        Menu
                    </button>
                </div>
                {children}
            </main>
        </div>
    )
}

export default DashboardLayout
