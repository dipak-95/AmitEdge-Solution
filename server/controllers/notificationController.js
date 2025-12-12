const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user.id }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.markRead = async (req, res) => { // Optional but good
    try {
        const notification = await Notification.findById(req.params.id);
        if (notification.recipient.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

        notification.read = true;
        await notification.save();
        res.json(notification);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
