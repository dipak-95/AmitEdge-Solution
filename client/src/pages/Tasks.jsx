import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await api.get('/tasks');
            setTasks(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete task?')) return;
        try {
            await api.delete(`/tasks/${id}`);
            setTasks(tasks.filter(t => t._id !== id));
        } catch (err) {
            alert('Error deleting task');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Tasks</h2>
                <Link to="/tasks/new" className="bg-blue-600 text-white px-4 py-2 rounded">
                    + New Task
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tasks.map(task => (
                    <div key={task._id} className="bg-white p-4 rounded shadow hover:shadow-lg transition">
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-bold">{task.title}</h3>
                            <span className={`px-2 py-1 text-xs rounded ${task.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-gray-100 text-gray-800'
                                }`}>
                                {task.status}
                            </span>
                        </div>
                        <p className="text-gray-600 text-sm mt-2 line-clamp-2">{task.description}</p>
                        <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                            <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
                            <span>Pri: {task.priority}</span>
                        </div>
                        <div className="mt-4 flex justify-between">
                            <Link to={`/tasks/${task._id}`} className="text-blue-600 hover:underline">View</Link>
                            {/* Only admin delete logic usually, but catch error if employee tries */}
                            <button onClick={() => handleDelete(task._id)} className="text-red-500 hover:underline">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tasks;
