import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import { Users, DoorOpen, CreditCard, TrendingUp } from 'lucide-react'

const Dashboard = () => {
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()

    const stats = [
        {
            title: 'Total Students',
            count: '0',
            icon: Users,
            color: 'bg-blue-500',
            action: () => navigate('/students')
        },
        {
            title: 'Total Rooms',
            count: '0',
            icon: DoorOpen,
            color: 'bg-green-500',
            action: () => navigate('/rooms')
        },
        {
            title: 'Pending Fees',
            count: '0',
            icon: CreditCard,
            color: 'bg-orange-500',
            action: () => navigate('/fees')
        },
        {
            title: 'Revenue',
            count: '₹0',
            icon: TrendingUp,
            color: 'bg-purple-500',
            action: () => navigate('/fees')
        }
    ]

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                    Welcome, {user?.name}! 👋
                </h1>
                <p className="text-gray-600 mt-2">
                    Here's what's happening in your hostel today.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => {
                    const Icon = stat.icon
                    return (
                        <div
                            key={index}
                            onClick={stat.action}
                            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">
                                        {stat.title}
                                    </p>
                                    <p className="text-3xl font-bold text-gray-800 mt-2">
                                        {stat.count}
                                    </p>
                                </div>
                                <div className={`${stat.color} p-4 rounded-lg`}>
                                    <Icon className="text-white" size={28} />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        Recent Activity
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b">
                            <div>
                                <p className="font-medium text-gray-800">
                                    New Student Registration
                                </p>
                                <p className="text-sm text-gray-500">
                                    Click on Students to view details
                                </p>
                            </div>
                            <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                                New
                            </span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b">
                            <div>
                                <p className="font-medium text-gray-800">
                                    Room Booking Request
                                </p>
                                <p className="text-sm text-gray-500">
                                    Check Bookings for pending requests
                                </p>
                            </div>
                            <span className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                                Pending
                            </span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        Quick Actions
                    </h2>
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/students')}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition"
                        >
                            View Students
                        </button>
                        <button
                            onClick={() => navigate('/rooms')}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition"
                        >
                            View Rooms
                        </button>
                        <button
                            onClick={() => navigate('/fees')}
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 rounded-lg transition"
                        >
                            View Fees
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
