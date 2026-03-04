import React, { useContext } from 'react'
import Sidebar from './Sidebar'
import AuthContext from '../context/AuthContext'

const DashboardLayout = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext)

    if (!isAuthenticated) {
        return <>{children}</>
    }

    return (
        <div className="flex bg-gray-100">
            <Sidebar />
            <main className="flex-1 w-full">
                {children}
            </main>
        </div>
    )
}

export default DashboardLayout
