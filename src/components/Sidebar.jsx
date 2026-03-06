import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Menu, X, Home, Users, DoorOpen, CreditCard, Calendar } from 'lucide-react';
import { getUnreadCount } from '../api/notificationApi';
import AuthContext from '../context/AuthContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
    const [isCollapsedDesktop, setIsCollapsedDesktop] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const [unreadCount, setUnreadCount] = useState(0);

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

    React.useEffect(() => {
        setIsOpen(false);
    }, [location.pathname, setIsOpen]);

    let menuItems = [];
    if (user?.role === 'ADMIN') {
        menuItems = [
            { path: '/dashboard', label: 'Dashboard', icon: Home },
            { path: '/pending-requests', label: 'Pending Requests', icon: Calendar },
            { path: '/students', label: 'Students', icon: Users },
            { path: '/rooms', label: 'Rooms', icon: DoorOpen },
            { path: '/fees', label: 'Fees', icon: CreditCard },
        ];
    } else {
        menuItems = [
            { path: '/browse-rooms', label: 'Browse Rooms', icon: DoorOpen },
            { path: '/student-request', label: 'Request Room', icon: Users },
            { path: '/my-requests', label: 'My Requests', icon: Calendar },
            {
                path: '/notifications',
                label: `Notifications${unreadCount > 0 ? ` (${unreadCount})` : ''}`,
                icon: CreditCard,
            },
        ];
    }

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    const desktopWidthClass = isCollapsedDesktop ? 'lg:w-20' : 'lg:w-64';
    const mobileTranslateClass = isOpen ? 'translate-x-0' : '-translate-x-full';

    return (
        <>
            <aside
                className={`${mobileTranslateClass} lg:translate-x-0 ${desktopWidthClass} fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#0E1524] text-white transition-all duration-300 z-40 overflow-y-auto`}
            >
                <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                    {!isCollapsedDesktop && <h3 className="text-xl font-bold">HMS</h3>}

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-gray-700 rounded-lg transition lg:hidden"
                            aria-label="Close sidebar"
                        >
                            <X size={20} />
                        </button>
                        <button
                            onClick={() => setIsCollapsedDesktop((prev) => !prev)}
                            className="p-2 hover:bg-gray-700 rounded-lg transition hidden lg:block"
                            aria-label="Toggle sidebar width"
                        >
                            {isCollapsedDesktop ? <Menu size={20} /> : <X size={20} />}
                        </button>
                    </div>
                </div>

                {!isCollapsedDesktop && (
                    <div className="p-4 border-b border-gray-700">
                        <p className="text-sm text-gray-400">Logged in as</p>
                        <p className="font-semibold truncate">{user?.name}</p>
                        <p className="text-xs text-indigo-400 mt-1 uppercase font-semibold">
                            {user?.role}
                        </p>
                    </div>
                )}

                <nav className="p-3 space-y-2">
                    {menuItems.map(({ path, label, icon: Icon }) => (
                        <Link
                            key={path}
                            to={path}
                            className={`flex items-center gap-3 px-3 py-3 rounded-lg transition ${isActive(path)
                                ? 'bg-indigo-600 text-white'
                                : 'text-gray-300 hover:bg-gray-700'
                                }`}
                            title={label}
                        >
                            <Icon size={20} />
                            {!isCollapsedDesktop && <span>{label}</span>}
                        </Link>
                    ))}
                </nav>

                <div className="p-3 border-t border-gray-700 mt-auto">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition text-white font-medium"
                    >
                        <LogOut size={20} />
                        {!isCollapsedDesktop && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default Sidebar;
