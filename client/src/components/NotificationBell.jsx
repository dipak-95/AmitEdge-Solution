import { useState, useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import api from '../services/api';
import useSocket from '../hooks/useSocket';
import { useAuth } from '../context/AuthContext';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const socket = useSocket();
    const { user } = useAuth();

    useEffect(() => {
        fetchNotifications();
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('notification', (newNotification) => {
                setNotifications((prev) => [newNotification, ...prev]);
                setUnreadCount((prev) => prev + 1);
            });
            socket.on('task_updated', (task) => {
                // Maybe trigger refresh or just rely on generic notification if backend sends both.
                // Backend sends notification object too, so this might be redundant for the bell itself, 
                // but useful for toast. Keeping simple.
            });
            socket.on('leave_update', () => { });
        }
    }, [socket]);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data);
            setUnreadCount(res.data.filter(n => !n.read).length);
        } catch (err) {
            console.error(err);
        }
    };

    const handleRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="relative">
            <button
                className="p-2 text-gray-600 hover:text-gray-800 relative"
                onClick={() => setShowDropdown(!showDropdown)}
            >
                <FaBell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                        {unreadCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-lg z-50 max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-gray-500 text-sm">No notifications</div>
                    ) : (
                        notifications.map(n => (
                            <div
                                key={n._id}
                                className={`p-3 border-b text-sm cursor-pointer ${n.read ? 'bg-gray-50' : 'bg-blue-50'}`}
                                onClick={() => handleRead(n._id)}
                            >
                                <p>{n.message}</p>
                                <span className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
