const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    checkIn: Date,
    checkOut: Date,
    status: {
        type: String,
        enum: ['present', 'absent', 'late', 'half-day'],
        default: 'absent'
    }
}, { timestamps: true });

// Compound index for user and date to prevent loose duplicates if needed, 
// though application logic usually handles 'today' checks.
AttendanceSchema.index({ user: 1, date: 1 });

module.exports = mongoose.model('Attendance', AttendanceSchema);
