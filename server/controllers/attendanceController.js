const Attendance = require('../models/Attendance');

exports.checkInOrOut = async (req, res) => {
    try {
        const userId = req.user.id;
        const now = new Date();
        const startOfDay = new Date(now.setHours(0, 0, 0, 0));
        const endOfDay = new Date(now.setHours(23, 59, 59, 999));

        // Find today's record
        let attendance = await Attendance.findOne({
            user: userId,
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        if (attendance) {
            // Already checked in, check out
            if (attendance.checkOut) {
                return res.status(400).json({ message: 'Already completed attendance for today' });
            }
            attendance.checkOut = new Date();
            // Calculate status if needed (e.g., hours worked > x => present)
            // For now, keep as is or update status
            attendance.status = 'present';
            await attendance.save();
            res.json({ message: 'Checked Out', attendance });
        } else {
            // Check in
            attendance = new Attendance({
                user: userId,
                date: startOfDay,
                checkIn: new Date(),
                status: 'present' // Or 'present' upon checkin? Usually present.
            });
            await attendance.save();
            res.json({ message: 'Checked In', attendance });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAttendance = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'employee') {
            query = { user: req.user.id };
        }
        const attendance = await Attendance.find(query).populate('user', 'username');
        res.json(attendance);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
