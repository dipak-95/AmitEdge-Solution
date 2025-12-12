import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Leaves = () => {
    const [leaves, setLeaves] = useState([]);
    const [formData, setFormData] = useState({ type: 'Sick', startDate: '', endDate: '', reason: '' });
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const isSuperAdmin = user?.role === 'superadmin';

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const res = await api.get('/leaves');
            setLeaves(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/leaves', formData);
            setFormData({ type: 'Sick', startDate: '', endDate: '', reason: '' });
            fetchLeaves();
            alert('Leave requested');
        } catch (err) {
            alert('Error requesting leave: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await api.put(`/leaves/${id}`, { status });
            fetchLeaves();
        } catch (e) {
            alert('Error updating status');
        }
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Leave Management</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {!isSuperAdmin && (
                    <div className="bg-white p-6 rounded shadow h-fit">
                        <h3 className="text-xl font-semibold mb-4">Request Leave</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block mb-2 text-sm">Type</label>
                                <select className="w-full border p-2 rounded" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                    <option>Sick</option>
                                    <option>Casual</option>
                                    <option>Earned</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block mb-2 text-sm">Start Date</label>
                                    <input type="date" className="w-full border p-2 rounded" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} required />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm">End Date</label>
                                    <input type="date" className="w-full border p-2 rounded" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} required />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2 text-sm">Reason</label>
                                <textarea className="w-full border p-2 rounded" value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })}></textarea>
                            </div>
                            <button className="w-full bg-blue-600 text-white py-2 rounded">Submit Request</button>
                        </form>
                    </div>
                )}

                <div className={`bg-white p-6 rounded shadow ${isSuperAdmin ? 'col-span-2' : ''}`}>
                    <h3 className="text-xl font-semibold mb-4">{isSuperAdmin ? 'All Leave Requests' : 'My Leaves'}</h3>
                    <div className="space-y-4">
                        {loading ? <p>Loading...</p> : leaves.map(leave => (
                            <div key={leave._id} className="border-b pb-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="font-bold">{leave.type}</span>
                                        {isSuperAdmin && <span className="text-gray-500 text-sm ml-2"> by {leave.user?.username}</span>}
                                    </div>
                                    <span className={`text-sm px-2 py-0.5 rounded ${leave.status === 'approved' ? 'bg-green-100 text-green-800' : leave.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{leave.status}</span>
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                    {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                </div>
                                <p className="text-sm mt-1">{leave.reason}</p>

                                {isSuperAdmin && leave.status === 'pending' && (
                                    <div className="mt-3 flex gap-2">
                                        <button onClick={() => handleStatusUpdate(leave._id, 'approved')} className="bg-green-500 text-white text-xs px-3 py-1 rounded hover:bg-green-600">Approve</button>
                                        <button onClick={() => handleStatusUpdate(leave._id, 'rejected')} className="bg-red-500 text-white text-xs px-3 py-1 rounded hover:bg-red-600">Reject</button>
                                    </div>
                                )}
                            </div>
                        ))}
                        {leaves.length === 0 && <p className="text-gray-500">No leave requests found.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leaves;
