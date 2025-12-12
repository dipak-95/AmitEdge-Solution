import { useEffect, useState } from 'react';
import api from '../services/api';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/reports');
                setStats(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="p-4">Loading stats...</div>;
    if (!stats) return <div className="p-4">Error loading stats</div>;

    const statusData = stats.tasksByStatus.map(s => ({ name: s._id, value: s.count }));
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    const employeeData = stats.completedByEmployee.map(e => ({
        name: e._id?.username || 'Unknown',
        completed: e.count
    }));

    const attendanceData = [
        { name: 'Present', value: stats.attendanceStats.present },
        { name: 'Absent', value: stats.attendanceStats.absent },
        { name: 'Late', value: stats.attendanceStats.late },
    ];
    const ATTENDANCE_COLORS = ['#4ade80', '#f87171', '#fbbf24'];

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Task Status Pie */}
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="text-lg font-semibold mb-4">Tasks by Status</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Completed per Employee Bar */}
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="text-lg font-semibold mb-4">Completed Tasks / Employee</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={employeeData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="completed" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Attendance Donut */}
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="text-lg font-semibold mb-4">Attendance Overview</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={attendanceData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {attendanceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={ATTENDANCE_COLORS[index % ATTENDANCE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
