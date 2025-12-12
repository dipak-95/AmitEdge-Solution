import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import api from '../services/api';

const Topbar = () => {
    const { user, logout } = useAuth();
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passData, setPassData] = useState({ oldPassword: '', newPassword: '' });

    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/change-password', passData);
            alert('Password Changed Successfully');
            setShowPasswordModal(false);
            setPassData({ oldPassword: '', newPassword: '' });
        } catch (err) {
            alert(err.response?.data?.message || 'Error changing password');
        }
    };

    return (
        <>
            <div className="bg-white shadow p-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Welcome, {user?.username}</h2>
                <div className="flex items-center space-x-4">
                    <NotificationBell />
                    <div className="flex items-center space-x-2">
                        <span className="text-sm bg-gray-200 rounded px-2 py-1" title={user?.role}>
                            {user?.username?.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                        <button onClick={() => setShowPasswordModal(true)} className="text-sm text-blue-600 hover:underline">Change Password</button>
                        <button onClick={logout} className="text-sm text-red-600 hover:text-red-800">Logout</button>
                    </div>
                </div>
            </div>

            {showPasswordModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h3 className="text-xl font-bold mb-4">Change Password</h3>
                        <form onSubmit={handleChangePassword}>
                            <div className="mb-4">
                                <label className="block text-sm mb-1">Old Password</label>
                                <input type="password" className="w-full border p-2 rounded" value={passData.oldPassword} onChange={e => setPassData({ ...passData, oldPassword: e.target.value })} required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm mb-1">New Password</label>
                                <input type="password" className="w-full border p-2 rounded" value={passData.newPassword} onChange={e => setPassData({ ...passData, newPassword: e.target.value })} required />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setShowPasswordModal(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Topbar;
