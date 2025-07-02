const express = require('express');
const router = express.Router();
const { isLoggedIn, isAdmin, isCustomer } = require('../middlewares/user');

const {
    createBookings,
    getBookings,
    getAllBookings,
} = require('../controllers/bookingController');

// Customer routes - use isCustomer middleware to prevent admin access
router.route('/').get(isCustomer, getBookings).post(isCustomer, createBookings);

// Admin routes for viewing all bookings
router.route('/admin/all').get(isAdmin, getAllBookings);

module.exports = router;
