import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const NewTask = () => {
    const [formData, setFormData] = useState({
        title: '', description: '', assignedTo: '', priority: 'medium', deadline: '', attachments: []
    });
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const { user } = useAuth();
    const isSuperAdmin = user?.role === 'superadmin';

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get('/users');
                // Filter out self if superadmin
                let availableUsers = res.data;
                if (isSuperAdmin && user) {
                    availableUsers = availableUsers.filter(u => u._id !== user.id);
                }
                setUsers(availableUsers);
            } catch (err) {
                console.error(err);
            }
        };
        if (user) fetchUsers(); // Wait for user context
    }, [user, isSuperAdmin]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isSuperAdmin && formData.assignedTo === user.id) {
                alert("Superadmin cannot assign task to themselves.");
                return;
            }
            await api.post('/tasks', formData);
            navigate('/tasks');
        } catch (err) {
            alert('Error creating task: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Create New Task</h2>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
                <div className="mb-4">
                    <label className="block mb-2">Title</label>
                    <input name="title" onChange={handleChange} className="w-full border p-2 rounded" required />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Description</label>
                    <textarea name="description" onChange={handleChange} className="w-full border p-2 rounded" rows="3"></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block mb-2">Assign To</label>
                        <select name="assignedTo" onChange={handleChange} className="w-full border p-2 rounded" required>
                            <option value="">Select User</option>
                            {users.map(u => <option key={u._id} value={u._id}>{u.username} ({u.role})</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block mb-2">Priority</label>
                        <select name="priority" onChange={handleChange} className="w-full border p-2 rounded" value={formData.priority}>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                </div>
                <div className="mb-6">
                    <label className="block mb-2">Deadline</label>
                    <input type="date" name="deadline" onChange={handleChange} className="w-full border p-2 rounded" />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Create Task</button>
            </form>
        </div>
    );
};

export default NewTask;
