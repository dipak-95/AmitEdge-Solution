import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const TaskDetail = () => {
    const { id } = useParams();
    const [task, setTask] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const res = await api.get(`/tasks/${id}`);
                setTask(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchTask();
    }, [id]);

    const updateStatus = async (newStatus) => {
        try {
            const res = await api.put(`/tasks/${id}`, { status: newStatus });
            setTask(res.data);
        } catch (err) {
            alert('Error updating status');
        }
    };

    if (!task) return <div>Loading...</div>;

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <button onClick={() => navigate(-1)} className="mb-4 text-gray-500 hover:underline">&larr; Back</button>
            <div className="bg-white p-6 rounded shadow">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-3xl font-bold">{task.title}</h2>
                    <select
                        value={task.status}
                        onChange={(e) => updateStatus(e.target.value)}
                        className="border p-2 rounded bg-gray-50"
                    >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="overdue">Overdue</option>
                    </select>
                </div>
                <p className="text-gray-600 mb-6 whitespace-pre-line">{task.description}</p>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                    <div><strong>Assigned To:</strong> {task.assignedTo?.username}</div>
                    <div><strong>Created By:</strong> {task.createdBy?.username}</div>
                    <div><strong>Priority:</strong> {task.priority}</div>
                    <div><strong>Deadline:</strong> {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'None'}</div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetail;
