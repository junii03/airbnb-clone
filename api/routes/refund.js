const express = require('express');
const router = express.Router();
const { isLoggedIn, isAdmin, optionalAuth } = require('../middlewares/user');

const {
    submitRefundRequest,
    getUserRefundRequests,
    getRefundRequestsByEmail,
    getAllRefundRequests,
    processRefundRequest
} = require('../controllers/refundController');

// Public route for refund request submission with optional authentication
router.route('/').post(optionalAuth, submitRefundRequest);

// Public route to check refund requests by email
router.route('/email/:email').get(getRefundRequestsByEmail);

// User routes (authentication required - both customers and admins can access their own refunds)
router.route('/user').get(isLoggedIn, getUserRefundRequests);

// Admin routes
router.route('/admin/all').get(isAdmin, getAllRefundRequests);
router.route('/admin/:id/process').put(isAdmin, processRefundRequest);

module.exports = router;
