import React, { useState, useEffect } from 'react';
import {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllRead
} from '../api/notificationApi';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            const list = await getNotifications();
            const count = await getUnreadCount();
            setNotifications(list);
            setUnreadCount(count.unreadCount);
        } catch (err) {
            setError('Unable to load notifications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleMark = async (id) => {
        await markAsRead(id);
        fetchData();
    };

    const handleMarkAll = async () => {
        await markAllRead();
        fetchData();
    };

    if (loading) return <p className="p-4">Loading...</p>;
    if (error) return <p className="p-4 text-red-600">{error}</p>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Notifications</h2>
                {unreadCount > 0 && (
                    <button
                        onClick={handleMarkAll}
                        className="text-sm text-indigo-600 hover:underline"
                    >
                        Mark all read
                    </button>
                )}
            </div>
            {notifications.length === 0 && <p>No notifications.</p>}
            <div className="space-y-3">
                {notifications.map(n => (
                    <div key={n.id} className={`p-4 rounded-lg border ${n.read ? 'bg-gray-50' : 'bg-white shadow'}`}>
                        <div className="flex justify-between items-center">
                            <p className="font-medium">{n.title}</p>
                            {!n.read && (
                                <button
                                    onClick={() => handleMark(n.id)}
                                    className="text-sm text-indigo-600 hover:underline"
                                >
                                    Mark read
                                </button>
                            )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notifications;
