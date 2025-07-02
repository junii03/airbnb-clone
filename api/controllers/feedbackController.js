const Feedback = require('../models/Feedback');

// Submit feedback (customers only)
exports.submitFeedback = async (req, res) => {
    try {
        const userData = req.user;
        const { type, subject, message, rating } = req.body;

        if (!type || !subject || !message) {
            return res.status(400).json({
                message: 'Type, subject, and message are required',
            });
        }

        const feedback = await Feedback.create({
            user: userData.id,
            type,
            subject,
            message,
            rating: rating || null,
        });

        res.status(201).json({
            success: true,
            message: 'Feedback submitted successfully',
            feedback,
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal server error',
            error: err,
        });
    }
};

// Get user's own feedback (customers only)
exports.getFeedback = async (req, res) => {
    try {
        const userData = req.user;

        const feedback = await Feedback.find({ user: userData.id })
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
