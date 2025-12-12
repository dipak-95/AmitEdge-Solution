import { useEffect, useState } from 'react';
import api from '../services/api';

const Reports = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/reports');
                setData(res.data);
            } catch (e) {
                console.error(e);
            }
        };
        fetchData();
    }, []);

    if (!data) return <div>Loading...</div>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">System Reports</h2>

            <div className="space-y-6">
                <div className="bg-white p-6 rounded shadow">
                    <h3 className="text-xl font-bold mb-4">Task Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {data.tasksByStatus.map(s => (
                            <div key={s._id} className="bg-blue-50 p-4 rounded text-center">
                                <div className="text-2xl font-bold text-blue-600">{s.count}</div>
                                <div className="text-sm text-gray-600 capitalize">{s._id}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded shadow">
                    <h3 className="text-xl font-bold mb-4">Employee Performance (Completed Tasks)</h3>
                    <ul>
                        {data.completedByEmployee.map(e => (
                            <li key={e._id?._id || 'unknown'} className="flex justify-between border-b py-2">
                                <span>{e._id?.username || 'Unknown'}</span>
                                <span className="font-bold">{e.count}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Reports;
