const Feedback = require('../models/Feedback');
const User = require('../models/User');

// Submit feedback (public endpoint - no authentication required)
exports.submitFeedback = async (req, res) => {
    try {
        const { type, subject, message, rating, name, email } = req.body;

        console.log('Submit feedback called with req.user:', req.user ? req.user.email : 'No user');
        console.log('Request body:', { type, subject, message, rating, name, email });

        if (!type || !subject || !message) {
            return res.status(400).json({
                message: 'Type, subject, and message are required',
            });
        }

        // Create feedback object
        const feedbackData = {
            type,
            subject,
            message,
            rating: rating || null,
            name: name || null,
            email: email || null
        };

        // Try to link to user account if user is authenticated or email matches a registered user
        if (req.user) {
            // User is authenticated - set both user and createdBy
            feedbackData.user = req.user._id;
            feedbackData.createdBy = req.user._id;
            console.log('User authenticated, setting user and createdBy to:', req.user._id);
        } else if (email) {
            // Try to find user by email
            try {
                const user = await User.findOne({ email: email.toLowerCase() });
                if (user) {
                    feedbackData.user = user._id;
                    console.log('Found user by email, setting user to:', user._id);
                }
            } catch (error) {
                // Continue without linking to user if lookup fails
                console.log('User lookup error:', error);
            }
        }

        console.log('Final feedback data before save:', feedbackData);
        const feedback = await Feedback.create(feedbackData);
        console.log('Feedback created successfully with ID:', feedback._id);
        console.log('Created feedback object:', {
            _id: feedback._id,
            user: feedback.user,
            createdBy: feedback.createdBy,
            email: feedback.email,
            subject: feedback.subject
        });

        res.status(201).json({
            success: true,
            message: 'Feedback submitted successfully',
            feedback: {
                id: feedback._id,
                type: feedback.type,
                subject: feedback.subject,
                status: feedback.status,
                createdAt: feedback.createdAt
            }
        });
    } catch (err) {
        console.error('Submit feedback error:', err);
        res.status(500).json({
            message: 'Internal server error',
            error: err.message,
        });
    }
};

// Get user's own feedback (requires authentication)
exports.getFeedback = async (req, res) => {
    try {
        console.log('getFeedback called, req.user:', req.user);
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

        // Find feedback by createdBy (primary) or by user/email (fallback for older records)
        const feedback = await Feedback.find({
            $or: [
                { createdBy: userData._id },
                { user: userData._id },
                { email: userData.email, createdBy: { $exists: false } }
            ]
        }).sort({ createdAt: -1 });

        console.log('Feedback found:', feedback.length, 'items');

        // Update older feedback records to include createdBy field
        const feedbackToUpdate = feedback.filter(f => !f.createdBy && (f.user?.equals(userData._id) || f.email === userData.email));
        if (feedbackToUpdate.length > 0) {
            console.log('Updating feedback records with createdBy field:', feedbackToUpdate.length, 'items');
            await Feedback.updateMany(
                {
                    _id: { $in: feedbackToUpdate.map(f => f._id) }
                },
                {
                    createdBy: userData._id,
                    user: userData._id
                }
            );
        }

        res.status(200).json({
            success: true,
            feedback,
            total: feedback.length
        });
    } catch (err) {
        console.error('getFeedback error:', err);
        res.status(500).json({
            message: 'Internal server error',
            error: err.message,
        });
    }
};

// Get all feedback (admin only)
exports.getAllFeedback = async (req, res) => {
    try {
        const userData = req.user;

        if (!userData || !userData.isAdmin || userData.role !== 'admin') {
            return res.status(403).json({
                error: 'Admin access required'
            });
        }

        const feedback = await Feedback.find({})
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            feedback,
            total: feedback.length
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal server error',
            error: err,
        });
    }
};

// Respond to feedback (admin only)
exports.respondToFeedback = async (req, res) => {
    try {
        const userData = req.user;
        const { id } = req.params;
        const { response } = req.body;

        if (!userData || !userData.isAdmin || userData.role !== 'admin') {
            return res.status(403).json({
                error: 'Admin access required'
            });
        }

        if (!response || !response.trim()) {
            return res.status(400).json({
                message: 'Response is required'
            });
        }

        const feedback = await Feedback.findById(id);
        if (!feedback) {
            return res.status(404).json({
                message: 'Feedback not found'
            });
        }

        feedback.adminResponse = response.trim();
        feedback.respondedBy = userData.id;
        feedback.respondedAt = new Date();
        feedback.status = 'reviewed';

        await feedback.save();

        res.status(200).json({
            success: true,
            message: 'Response sent successfully',
            feedback
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal server error',
            error: err.message,
        });
    }
};
