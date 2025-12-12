import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameDay } from 'date-fns';

const AttendanceCalendar = ({ attendanceData }) => {
    const today = new Date();
    const start = startOfWeek(startOfMonth(today));
    const end = endOfWeek(endOfMonth(today));
    const days = eachDayOfInterval({ start, end });

    const getStatus = (date) => {
        const record = attendanceData.find(a => isSameDay(new Date(a.date), date));
        return record ? record.status : null;
    };

    const statusColors = {
        present: 'bg-green-200',
        absent: 'bg-red-200',
        late: 'bg-yellow-200',
        'half-day': 'bg-blue-200'
    };

    return (
        <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-4">{format(today, 'MMMM yyyy')}</h3>
            <div className="grid grid-cols-7 gap-2 text-center text-sm">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d} className="font-bold text-gray-400">{d}</div>)}
                {days.map((day, idx) => {
                    const status = getStatus(day);
                    return (
                        <div key={idx} className={`p-2 rounded h-10 flex items-center justify-center ${status ? statusColors[status] : 'bg-gray-50'}`}>
                            <span className={format(day, 'M') !== format(today, 'M') ? 'text-gray-300' : 'text-gray-700'}>
                                {format(day, 'd')}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AttendanceCalendar;
