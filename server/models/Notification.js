const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['task_assigned', 'task_updated', 'leave_update', 'general'],
        default: 'general'
    },
    read: {
        type: Boolean,
        default: false
    },
    relatedId: {
        type: mongoose.Schema.Types.ObjectId // Can be TaskId, LeaveId etc.
    }
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
