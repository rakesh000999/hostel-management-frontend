import React, { useState, useContext } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { LogOut, Menu, X, Home, Users, DoorOpen, CreditCard, Calendar } from 'lucide-react'
import { getUnreadCount } from '../api/notificationApi'
import AuthContext from '../context/AuthContext'

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true)
    const { user, logout } = useContext(AuthContext)
    const navigate = useNavigate()
    const location = useLocation()

    const [unreadCount, setUnreadCount] = useState(0);

    // fetch unread count when sidebar mounts
    React.useEffect(() => {
        const fetchCount = async () => {
            try {
                const res = await getUnreadCount();
                setUnreadCount(res.unreadCount || 0);
            } catch {
                // ignore
            }
        };
        fetchCount();
    }, []);

    let menuItems = [];
    if (user?.role === 'ADMIN') {
        menuItems = [
            { path: '/dashboard', label: 'Dashboard', icon: Home },
            { path: '/pending-requests', label: 'Pending Requests', icon: Calendar },
            { path: '/students', label: 'Students', icon: Users },
            { path: '/rooms', label: 'Rooms', icon: DoorOpen },
            { path: '/fees', label: 'Fees', icon: CreditCard },
            { path: '/bookings', label: 'Bookings', icon: Calendar },
        ];
    } else {
        // default to student menu
        menuItems = [
            { path: '/student-request', label: 'Request Room', icon: Users },
            { path: '/my-requests', label: 'My Requests', icon: Calendar },
            { path: '/notifications', label: `Notifications${unreadCount > 0 ? ` (${unreadCount})` : ''}`, icon: CreditCard },
        ];
    }

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    const isActive = (path) => location.pathname === path

    return (
        <div className="flex bg-gray-100 min-h-screen">
            {/* Sidebar */}
            <aside
                className={`${isOpen ? 'w-64' : 'w-20'
                    } bg-[#0E1524] text-white transition-all duration-300 fixed h-screen lg:relative overflow-y-auto z-40`}
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                    {isOpen && (
                        <h3 className="text-xl font-bold">HMS</h3>
                    )}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 hover:bg-gray-700 rounded-lg transition hidden lg:block"
                    >
                        {isOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* User Info */}
                {isOpen && (
                    <div className="p-6 border-b border-gray-700">
                        <p className="text-sm text-gray-400">Logged in as</p>
                        <p className="font-semibold truncate">{user?.name}</p>
                        <p className="text-xs text-indigo-400 mt-1 uppercase font-semibold">
                            {user?.role}
                        </p>
                    </div>
                )}

                {/* Menu Items */}
                <nav className="p-4 space-y-2">
                    {menuItems.map(({ path, label, icon: Icon }) => (
                        <Link
                            key={path}
                            to={path}
                            className={`flex items-center gap-4 px-4 py-3 rounded-lg transition ${isActive(path)
                                ? 'bg-indigo-600 text-white'
                                : 'text-gray-300 hover:bg-gray-700'
                                }`}
                        >
                            <Icon size={20} />
                            {isOpen && <span>{label}</span>}
                        </Link>
                    ))}
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-gray-700 mt-auto">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition text-white font-medium"
                    >
                        <LogOut size={20} />
                        {isOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}
        </div>
    )
}

export default Sidebar
