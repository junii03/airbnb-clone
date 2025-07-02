const Refund = require('../models/Refund');
const Booking = require('../models/Booking');
const User = require('../models/User');

// Submit refund request (public endpoint - no authentication required)
exports.submitRefundRequest = async (req, res) => {
    try {
        console.log('Submit refund request called with req.user:', req.user ? req.user.email : 'No user');
        console.log('Refund request received:', req.body);

        const {
            bookingReference,
            requestType,
            reason,
            name,
            email,
            phone,
            originalBookingDate,
            checkInDate,
            checkOutDate,
            totalAmount,
            description,
            supportingDocuments
        } = req.body;

        // Validate required fields
        if (!requestType || !reason || !name || !email || !description) {
            console.log('Validation failed:', { requestType, reason, name, email, description });
            return res.status(400).json({
                message: 'Request type, reason, name, email, and description are required'
            });
        }

        // Create refund request object
        const refundData = {
            requestType,
            reason,
            name,
            email,
            phone: phone || null,
            originalBookingDate: originalBookingDate || null,
            checkInDate: checkInDate || null,
            checkOutDate: checkOutDate || null,
            totalAmount: totalAmount || null,
            description,
            supportingDocuments: supportingDocuments || []
        };

        console.log('Refund data to be saved:', refundData);

        // If booking reference is provided, try to find the booking
        if (bookingReference) {
            try {
                // Check if bookingReference is a valid ObjectId format (24 hex characters)
                const mongoose = require('mongoose');
                if (mongoose.Types.ObjectId.isValid(bookingReference)) {
                    const booking = await Booking.findById(bookingReference);
                    if (booking) {
                        refundData.booking = bookingReference;
                        refundData.bookingReference = bookingReference;
                    } else {
                        // Valid ObjectId format but booking not found
                        refundData.bookingReference = bookingReference;
                    }
                } else {
                    // Invalid ObjectId format, store as text reference
                    refundData.bookingReference = bookingReference;
                }
            } catch (error) {
                // If any error occurs during booking lookup, just store as text reference
                console.log('Booking lookup error:', error.message);
                refundData.bookingReference = bookingReference;
            }
        }

        // Try to link to user account if user is authenticated or email matches a registered user
        if (req.user) {
            // User is authenticated - set both user and createdBy
            refundData.user = req.user._id;
            refundData.createdBy = req.user._id;
            console.log('User authenticated, setting user and createdBy to:', req.user._id);
        } else if (email) {
            try {
                const user = await User.findOne({ email: email.toLowerCase() });
                if (user) {
                    refundData.user = user._id;
                    console.log('Found user by email, setting user to:', user._id);
                }
            } catch (error) {
                // Continue without linking to user if lookup fails
                console.log('User lookup error:', error);
            }
        }

        console.log('Final refund data before save:', refundData);
        const refundRequest = await Refund.create(refundData);
        console.log('Refund request created successfully:', refundRequest._id);
        console.log('Created refund object:', {
            _id: refundRequest._id,
            user: refundRequest.user,
            createdBy: refundRequest.createdBy,
            email: refundRequest.email,
            requestType: refundRequest.requestType
        });

        res.status(201).json({
            success: true,
            message: 'Refund request submitted successfully',
            refundRequest: {
                id: refundRequest._id,
                requestType: refundRequest.requestType,
                reason: refundRequest.reason,
                status: refundRequest.status,
                createdAt: refundRequest.createdAt
            }
        });
    } catch (err) {
        console.error('Refund submission error:', err);
        console.error('Error details:', err.message);
        console.error('Error stack:', err.stack);
        res.status(500).json({
            message: 'Internal server error',
            error: err.message
        });
    }
};

// Get user's refund requests (requires authentication)
exports.getUserRefundRequests = async (req, res) => {
    try {
        console.log('getUserRefundRequests called, req.user:', req.user);
        const userData = req.user;
        if (!userData) {
            console.log('No user data found in request');
            return res.status(401).json({
                error: 'Authentication required'
            });
        }

        console.log('User data found:', {
            _id: userData._id,
            _id_string: userData._id.toString(),
            email: userData.email
        });

        // Find refund requests by createdBy (primary) or by user/email (fallback for older records)
        const refundRequests = await Refund.find({
            $or: [
                { createdBy: userData._id },
                { user: userData._id },
                { email: userData.email, createdBy: { $exists: false } }
            ]
        })
            .populate('booking', 'place checkIn checkOut price')
            .populate('processedBy', 'name')
            .sort({ createdAt: -1 });

        console.log('Refund requests found:', refundRequests.length, 'items');

        // Update older refund records to include createdBy field
        const refundsToUpdate = refundRequests.filter(r => !r.createdBy && (r.user?.equals(userData._id) || r.email === userData.email));
        if (refundsToUpdate.length > 0) {
            console.log('Updating refund records with createdBy field:', refundsToUpdate.length, 'items');
            await Refund.updateMany(
                {
                    _id: { $in: refundsToUpdate.map(r => r._id) }
                },
                {
                    createdBy: userData._id,
                    user: userData._id
                }
            );
        }

        res.status(200).json({
            success: true,
            refundRequests
        });
    } catch (err) {
        console.error('getUserRefundRequests error:', err);
        res.status(500).json({
            message: 'Internal server error',
            error: err.message
        });
    }
};

// Get refund requests by email (for non-authenticated users)
exports.getRefundRequestsByEmail = async (req, res) => {
    try {
        const { email } = req.params;

        if (!email) {
            return res.status(400).json({
                message: 'Email is required'
            });
        }

        const refundRequests = await Refund.find({ email })
            .populate('booking', 'place checkIn checkOut price')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            refundRequests
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal server error',
            error: err.message
        });
    }
};

// Get all refund requests (admin only)
exports.getAllRefundRequests = async (req, res) => {
    try {
        const userData = req.user;

        if (!userData || !userData.isAdmin || userData.role !== 'admin') {
            return res.status(403).json({
                error: 'Admin access required'
            });
        }

        const { status, page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        let filter = {};
        if (status) {
            filter.status = status;
        }

        const refundRequests = await Refund.find(filter)
            .populate('booking', 'place checkIn checkOut price')
            .populate('user', 'name email')
            .populate('processedBy', 'name')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip(skip);

        const total = await Refund.countDocuments(filter);

        res.status(200).json({
            success: true,
            refundRequests,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal server error',
            error: err.message
        });
    }
};

// Process refund request (admin only)
exports.processRefundRequest = async (req, res) => {
    try {
        const userData = req.user;
        const { id } = req.params;
        const { status, adminNotes, refundAmount, refundMethod } = req.body;

        if (!userData || !userData.isAdmin || userData.role !== 'admin') {
            return res.status(403).json({
                error: 'Admin access required'
            });
        }

        if (!status) {
            return res.status(400).json({
                message: 'Status is required'
            });
        }

        const refundRequest = await Refund.findById(id);
        if (!refundRequest) {
            return res.status(404).json({
                message: 'Refund request not found'
            });
        }

        refundRequest.status = status;
        refundRequest.adminNotes = adminNotes || null;
        refundRequest.refundAmount = refundAmount || null;
        refundRequest.refundMethod = refundMethod || 'original_payment';
        refundRequest.processedBy = userData.id;
        refundRequest.processedAt = new Date();

        await refundRequest.save();

        res.status(200).json({
            success: true,
            message: 'Refund request processed successfully',
            refundRequest
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal server error',
            error: err.message
        });
    }
};
