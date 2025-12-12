const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    title: String,
    type: {
        type: String,
        enum: ['attendance', 'task_performance', 'leaves'],
        required: true
    },
    generatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    data: mongoose.Schema.Types.Mixed, // Store JSON data of the report
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Report', ReportSchema);
