const Notification = require('../models/Notification');

const createNotification = async (recipientId, message, type, relatedId, io) => {
    try {
        const notification = new Notification({
            recipient: recipientId,
            message,
            type,
            relatedId
        });
        await notification.save();

        if (io) {
            io.to(recipientId.toString()).emit('notification', notification);
        }
        return notification;
    } catch (err) {
        console.error('Notification Error:', err);
    }
};

module.exports = { createNotification };
