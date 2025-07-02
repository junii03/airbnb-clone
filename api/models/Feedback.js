const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['complaint', 'suggestion', 'compliment', 'bug_report', 'general'],
        required: true
    },
    subject: {
        type: String,
        required: true,
        maxLength: [200, 'Subject should be under 200 characters']
    },
    message: {
        type: String,
        required: true,
        maxLength: [1000, 'Message should be under 1000 characters']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: null
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'resolved'],
        default: 'pending'
    },
    adminResponse: {
        type: String,
        default: null
    },
    respondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    respondedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Feedback', feedbackSchema);
