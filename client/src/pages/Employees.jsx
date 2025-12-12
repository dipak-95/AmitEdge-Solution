import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const { user } = useAuth();
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        username: '', email: '', password: '', role: 'employee', department: '', designation: ''
    });

    const isSuperAdmin = user?.role === 'superadmin';

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await api.get('/users');
            setEmployees(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await api.delete(`/users/${id}`);
            fetchEmployees();
        } catch (err) {
            alert('Error deleting user');
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/users', formData);
            setShowForm(false);
            setFormData({ username: '', email: '', password: '', role: 'employee', department: '', designation: '' });
            fetchEmployees();
            alert('User created successfully');
        } catch (err) {
            alert('Error creating user: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Employees & Users</h2>
                {isSuperAdmin && (
                    <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded">
                        {showForm ? 'Cancel' : '+ Add User'}
                    </button>
                )}
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded shadow mb-6 max-w-2xl">
                    <h3 className="text-xl font-bold mb-4">Create New User</h3>
                    <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input placeholder="Username" className="border p-2 rounded" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} required />
                        <input placeholder="Email" type="email" className="border p-2 rounded" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                        <input placeholder="Password" type="password" className="border p-2 rounded" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />
                        <select className="border p-2 rounded" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                            <option value="employee">Employee</option>
                            <option value="admin">Admin</option>
                            {/* Superadmin usually shouldn't create another superadmin easily, but if needed add here */}
                        </select>
                        <input placeholder="Department" className="border p-2 rounded" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} />
                        <input placeholder="Designation" className="border p-2 rounded" value={formData.designation} onChange={e => setFormData({ ...formData, designation: e.target.value })} />
                        <button type="submit" className="bg-green-600 text-white p-2 rounded md:col-span-2">Create User</button>
                    </form>
                </div>
            )}

            <div className="bg-white rounded shadow overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Dept / Desig</th>
                            {isSuperAdmin && <th className="p-4">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map(emp => (
                            <tr key={emp._id} className="border-b hover:bg-gray-50">
                                <td className="p-4 font-medium">{emp.username}</td>
                                <td className="p-4">{emp.email}</td>
                                <td className="p-4"><span className="bg-gray-200 text-xs px-2 py-1 rounded">{emp.role}</span></td>
                                <td className="p-4">{emp.department} / {emp.designation}</td>
                                {isSuperAdmin && (
                                    <td className="p-4">
                                        {emp.role !== 'superadmin' && (
                                            <button onClick={() => handleDelete(emp._id)} className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Employees;
