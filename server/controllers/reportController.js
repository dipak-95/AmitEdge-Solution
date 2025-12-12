const Task = require('../models/Task');
const Attendance = require('../models/Attendance');
const User = require('../models/User');

exports.getReports = async (req, res) => {
    try {
        // 1. Task Status Distribution
        const tasksByStatus = await Task.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        // 2. Completed Tasks per Employee
        const completedTasks = await Task.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: "$assignedTo", count: { $sum: 1 } } }
        ]);

        // Populate usernames for completedTasks
        const completedTasksWithNames = await User.populate(completedTasks, { path: '_id', select: 'username' });

        // 3. Attendance Stats (Simplified: Total Present count vs Total records)
        // Or per user? Spec says "Attendance% (donut)". Usually overall or per user. Assuming overall or User specific if employee.
        const totalAttendance = await Attendance.countDocuments();
        const presentAttendance = await Attendance.countDocuments({ status: 'present' });

        const attendanceStats = {
            total: totalAttendance,
            present: presentAttendance,
            late: await Attendance.countDocuments({ status: 'late' }),
            absent: await Attendance.countDocuments({ status: 'absent' })
        };

        res.json({
            tasksByStatus,
            completedByEmployee: completedTasksWithNames,
            attendanceStats
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
