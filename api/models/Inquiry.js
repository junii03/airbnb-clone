const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Allow inquiries from non-registered users
    },
    propertyId: {
        type: String,
        default: null
    },
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place',
        default: null
    },
    inquiryType: {
        type: String,
        enum: ['property_details', 'availability', 'special_requests', 'local_info', 'pricing', 'other'],
        required: true
    },
    name: {
        type: String,
        required: true,
        maxLength: [100, 'Name should be under 100 characters']
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        default: null
    },
    checkIn: {
        type: Date,
        default: null
    },
    checkOut: {
        type: Date,
        default: null
    },
    guests: {
        type: Number,
        default: 1,
        min: 1,
        max: 20
    },
    subject: {
        type: String,
        required: true,
        maxLength: [200, 'Subject should be under 200 characters']
    },
    message: {
        type: String,
        required: true,
        maxLength: [2000, 'Message should be under 2000 characters']
    },
    status: {
        type: String,
        enum: ['pending', 'responded', 'resolved'],
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
inquirySchema.index({ email: 1, createdAt: -1 });
inquirySchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Inquiry', inquirySchema);
