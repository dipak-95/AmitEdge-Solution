import { useState, useEffect } from 'react';
import api from '../services/api';
import AttendanceCalendar from '../components/AttendanceCalendar';
import { useAuth } from '../context/AuthContext';
import { isWithinInterval, startOfDay } from 'date-fns';

const Attendance = () => {
    const [attendance, setAttendance] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const isSuperAdmin = user?.role === 'superadmin';

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [attRes, leaveRes] = await Promise.all([
                api.get('/attendance'),
                api.get('/leaves')
            ]);
            setAttendance(attRes.data);
            setLeaves(leaveRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckInOut = async () => {
        try {
            await api.post('/attendance');
            fetchData();
            alert('Success');
        } catch (err) {
            alert(err.response?.data?.message || 'Error');
        }
    };

    const isLeaveToday = () => {
        const today = startOfDay(new Date());
        // Check if any approved leave covers today
        return leaves.some(l =>
            l.status === 'approved' &&
            isWithinInterval(today, {
                start: startOfDay(new Date(l.startDate)),
                end: startOfDay(new Date(l.endDate))
            })
        );
    };

    const canCheckInOut = !isLeaveToday() && !isSuperAdmin; // Superadmin doesn't mark attendance usually, or maybe they do? "superadmin sabki attendance dekh ske" - implying view only for others logic. Self attendance? Let's disable for superadmin to avoid clutter or if user wants. But usually Boss checks in. User didn't specify superadmin checkin, just view.
    // Actually "Superadmin cannot ... and vo khud leave nahi lega". 
    // Doesn't say can't check in. But usually explicit 'vo khud leave nahi lega' implies special status. 
    // Let's allow checkin if not on leave (which they can't take anyway). 

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Attendance</h2>
                {!isSuperAdmin && (
                    <button
                        onClick={handleCheckInOut}
                        disabled={isLeaveToday()}
                        className={`px-6 py-2 rounded shadow text-white ${isLeaveToday() ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                        {isLeaveToday() ? 'On Leave' : 'Check In / Out'}
                    </button>
                )}
            </div>

            {isSuperAdmin ? (
                <div className="bg-white rounded shadow overflow-x-auto">
                    <h3 className="text-xl font-semibold p-4 border-b">All Employee Attendance</h3>
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4">User</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">In Time</th>
                                <th className="p-4">Out Time</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendance.map(record => (
                                <tr key={record._id} className="border-b">
                                    <td className="p-4 font-medium">{record.user?.username || 'Unknown'}</td>
                                    <td className="p-4">{new Date(record.date).toLocaleDateString()}</td>
                                    <td className="p-4">{record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : '-'}</td>
                                    <td className="p-4">{record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : '-'}</td>
                                    <td className="p-4 capitalize">{record.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <AttendanceCalendar attendanceData={attendance} />

                    <div className="bg-white p-4 rounded shadow">
                        <h3 className="text-xl font-semibold mb-4">History</h3>
                        <ul className="divide-y">
                            {attendance.map(record => (
                                <li key={record._id} className="py-2 text-sm flex justify-between">
                                    <span>{new Date(record.date).toLocaleDateString()}</span>
                                    <div>
                                        <span className="mr-4">In: {record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : '-'}</span>
                                        <span>Out: {record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : '-'}</span>
                                    </div>
                                    <span className={`capitalize ${record.status === 'present' ? 'text-green-600' : 'text-red-500'}`}>{record.status}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Attendance;
