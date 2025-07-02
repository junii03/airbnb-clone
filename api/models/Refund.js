const mongoose = require('mongoose');

const refundSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Allow refund requests from non-registered users
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // For authenticated users who submit refund requests
    },
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        default: null
    },
    bookingReference: {
        type: String,
        default: null // For cases where user doesn't have booking ID
    },
    requestType: {
        type: String,
        enum: ['cancellation', 'refund', 'partial_refund', 'emergency_cancellation'],
        required: true
    },
    reason: {
        type: String,
        enum: ['change_of_plans', 'emergency', 'host_issue', 'property_issue', 'medical', 'other'],
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
    originalBookingDate: {
        type: Date,
        default: null
    },
    checkInDate: {
        type: Date,
        default: null
    },
    checkOutDate: {
        type: Date,
        default: null
    },
    totalAmount: {
        type: Number,
        default: null
    },
    refundAmount: {
        type: Number,
        default: null
    },
    description: {
        type: String,
        required: true,
        maxLength: [1000, 'Description should be under 1000 characters']
    },
    supportingDocuments: [{
        type: String, // URLs to uploaded documents
        default: []
    }],
    status: {
        type: String,
        enum: ['pending', 'under_review', 'approved', 'rejected', 'processed'],
        default: 'pending'
    },
    adminNotes: {
        type: String,
        default: null
    },
    processedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    processedAt: {
        type: Date,
        default: null
    },
    refundMethod: {
        type: String,
        enum: ['original_payment', 'bank_transfer', 'check', 'credit'],
        default: 'original_payment'
    }
}, {
    timestamps: true
});

// Index for better query performance
refundSchema.index({ email: 1, createdAt: -1 });
refundSchema.index({ status: 1, createdAt: -1 });
refundSchema.index({ bookingReference: 1 });
refundSchema.index({ createdBy: 1, createdAt: -1 });

module.exports = mongoose.model('Refund', refundSchema);
