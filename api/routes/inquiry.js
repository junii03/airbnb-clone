const express = require('express');
const router = express.Router();
const { isLoggedIn, isAdmin, isCustomer } = require('../middlewares/user');

const {
    submitInquiry,
    getUserInquiries,
    getInquiriesByEmail,
    getAllInquiries,
    respondToInquiry
} = require('../controllers/inquiryController');

// Public routes - no authentication required
router.route('/submit').post(submitInquiry);
router.route('/email/:email').get(getInquiriesByEmail);

// User routes - authentication required (customer only)
router.route('/user').get(isCustomer, getUserInquiries);

// Admin routes
router.route('/admin/all').get(isAdmin, getAllInquiries);
router.route('/admin/:id/respond').put(isAdmin, respondToInquiry);

module.exports = router;
