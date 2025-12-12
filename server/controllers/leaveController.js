const Leave = require('../models/Leave');
const { createNotification } = require('../utils/notification');

exports.requestLeave = async (req, res) => {
    try {
        if (req.user.role === 'superadmin') {
            return res.status(403).json({ message: 'Superadmin cannot request leave' });
        }
        const { type, startDate, endDate, reason } = req.body;
        const leave = new Leave({
            user: req.user.id,
            type,
            startDate,
            endDate,
            reason
        });
        await leave.save();

        // Notify Admins? For now, maybe not needed unless spec asks. 
        // Spec: "server emits ... leave_update"

        res.status(201).json(leave);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getLeaves = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'employee') {
            query = { user: req.user.id };
        }
        const leaves = await Leave.find(query).populate('user', 'username');
        res.json(leaves);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateLeaveStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const leave = await Leave.findById(req.params.id);
        if (!leave) return res.status(404).json({ message: 'Leave not found' });

        leave.status = status;
        await leave.save();

        const io = req.app.get('io');
        await createNotification(
            leave.user,
            `Your leave request has been ${status}`,
            'leave_update',
            leave._id,
            io
        );
        io.to(leave.user.toString()).emit('leave_update', leave);

        res.json(leave);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
