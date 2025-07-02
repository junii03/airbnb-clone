const Inquiry = require('../models/Inquiry');
const Place = require('../models/Place');
const User = require('../models/User');

// Submit inquiry (public endpoint - no authentication required)
exports.submitInquiry = async (req, res) => {
    try {
        const {
            propertyId,
            inquiryType,
            name,
            email,
            phone,
            checkIn,
            checkOut,
            guests,
            subject,
            message
        } = req.body;

        // Validate required fields
        if (!inquiryType || !name || !email || !subject || !message) {
            return res.status(400).json({
                message: 'Inquiry type, name, email, subject, and message are required'
            });
        }

        // Create inquiry object
        const inquiryData = {
            inquiryType,
            name,
            email,
            phone: phone || null,
            checkIn: checkIn || null,
            checkOut: checkOut || null,
            guests: guests || 1,
            subject,
            message
        };

        // If propertyId is provided, try to find the property
        if (propertyId) {
            const property = await Place.findById(propertyId);
            if (property) {
                inquiryData.property = propertyId;
                inquiryData.propertyId = propertyId;
            } else {
                // Store as text if property not found
                inquiryData.propertyId = propertyId;
            }
        }

        // Try to link to user account if email matches a registered user
        try {
            const user = await User.findOne({ email: email.toLowerCase() });
            if (user) {
                inquiryData.user = user._id;
            }
        } catch (error) {
            // Continue without linking to user if lookup fails
            console.log('User lookup error:', error);
        }

        const inquiry = await Inquiry.create(inquiryData);

        res.status(201).json({
            success: true,
            message: 'Inquiry submitted successfully',
            inquiry: {
                id: inquiry._id,
                inquiryType: inquiry.inquiryType,
                subject: inquiry.subject,
                status: inquiry.status,
                createdAt: inquiry.createdAt
            }
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal server error',
            error: err.message
        });
    }
};

// Get user's inquiries (requires authentication)
exports.getUserInquiries = async (req, res) => {
    try {
        const userData = req.user;
        if (!userData) {
            return res.status(401).json({
                error: 'Authentication required'
            });
        }

        // Find inquiries by user ID or by email (for inquiries submitted before login)
        const inquiries = await Inquiry.find({
            $or: [
                { user: userData.id },
                { email: userData.email, user: { $exists: false } }
            ]
        })
            .populate('property', 'title address photos')
            .sort({ createdAt: -1 });

        // Update inquiries to link them to the user account
        const unlinkedInquiries = inquiries.filter(inquiry => !inquiry.user);
        if (unlinkedInquiries.length > 0) {
            await Inquiry.updateMany(
                {
                    email: userData.email,
                    user: { $exists: false }
                },
                { user: userData.id }
            );
        }

        res.status(200).json({
            success: true,
            inquiries
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal server error',
            error: err.message
        });
    }
};

// Get inquiries by email (for non-authenticated users)
exports.getInquiriesByEmail = async (req, res) => {
    try {
        const { email } = req.params;

        if (!email) {
            return res.status(400).json({
                message: 'Email is required'
            });
        }

        const inquiries = await Inquiry.find({ email })
            .populate('property', 'title address photos')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            inquiries
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal server error',
            error: err.message
        });
    }
};

// Get all inquiries (admin only)
exports.getAllInquiries = async (req, res) => {
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

        const inquiries = await Inquiry.find(filter)
            .populate('property', 'title address')
            .populate('user', 'name email')
            .populate('respondedBy', 'name')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip(skip);

        const total = await Inquiry.countDocuments(filter);

        res.status(200).json({
            success: true,
            inquiries,
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

// Respond to inquiry (admin only)
exports.respondToInquiry = async (req, res) => {
    try {
        const userData = req.user;
        const { id } = req.params;
        const { response } = req.body;

        if (!userData || !userData.isAdmin || userData.role !== 'admin') {
            return res.status(403).json({
                error: 'Admin access required'
            });
        }

        if (!response) {
            return res.status(400).json({
                message: 'Response is required'
            });
        }

        const inquiry = await Inquiry.findById(id);
        if (!inquiry) {
            return res.status(404).json({
                message: 'Inquiry not found'
            });
        }

        inquiry.adminResponse = response;
        inquiry.status = 'responded';
        inquiry.respondedBy = userData.id;
        inquiry.respondedAt = new Date();

        await inquiry.save();

        res.status(200).json({
            success: true,
            message: 'Response sent successfully',
            inquiry
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal server error',
            error: err.message
        });
    }
};
