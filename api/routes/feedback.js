const express = require('express');
const router = express.Router();
const { isCustomer } = require('../middlewares/user');

const {
    submitFeedback,
    getFeedback,
    getAllFeedback
} = require('../controllers/feedbackController');

// Customer routes
router.route('/').post(isCustomer, submitFeedback);
router.route('/user').get(isCustomer, getFeedback);

// Admin routes
router.route('/admin/all').get(require('../middlewares/user').isAdmin, getAllFeedback);

module.exports = router;
