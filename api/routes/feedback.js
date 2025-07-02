const express = require('express');
const router = express.Router();
const { isLoggedIn, isAdmin, optionalAuth } = require('../middlewares/user');

const {
    submitFeedback,
    getFeedback,
    getAllFeedback,
    respondToFeedback
} = require('../controllers/feedbackController');

// Public route for feedback submission with optional authentication
router.route('/').post(optionalAuth, submitFeedback);

// User routes (authentication required - both customers and admins can access their own feedback)
router.route('/user').get(isLoggedIn, getFeedback);

// Admin routes
router.route('/admin/all').get(isAdmin, getAllFeedback);
router.route('/admin/:id/respond').put(isAdmin, respondToFeedback);

module.exports = router;
