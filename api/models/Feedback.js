const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Allow feedback from non-registered users
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // For authenticated users who submit feedback
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
    // Fields for non-authenticated users
    name: {
        type: String,
        default: null,
        maxLength: [100, 'Name should be under 100 characters']
    },
    email: {
        type: String,
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

// Index for better query performance
feedbackSchema.index({ email: 1, createdAt: -1 });
feedbackSchema.index({ status: 1, createdAt: -1 });
feedbackSchema.index({ createdBy: 1, createdAt: -1 });

module.exports = mongoose.model('Feedback', feedbackSchema);
