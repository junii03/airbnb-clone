const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Checks user is logged in based on passed token and set the user in request
exports.isLoggedIn = async (req, res, next) => {
    // token could be found in request cookies or in reqest headers
    const token = req.cookies.token || req.header('Authorization').replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Login first to access this page',
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        // Handle JWT verification error
        console.error('JWT verification error:', error);
        return res.status(401).json({
            success: false,
            message: 'Invalid token',
        });
    }
};

// Checks if user is admin
exports.isAdmin = async (req, res, next) => {
    try {
        // First check if user is logged in
        const token = req.cookies.token || req.header('Authorization').replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Admin access required - Please login',
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found',
            });
        }

        // Check if user is admin
        if (!user.isAdmin && user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Admin access required',
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Admin verification error:', error);
        return res.status(401).json({
            success: false,
            message: 'Invalid token',
        });
    }
};

// Checks if user is customer (not admin) - for customer-only endpoints
exports.isCustomer = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.header('Authorization').replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Customer access required - Please login',
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found',
            });
        }

        // Check if user is NOT admin (customer only)
        if (user.isAdmin || user.role === 'admin') {
            return res.status(403).json({
                success: false,
                message: 'This endpoint is for customers only. Please use admin endpoints.',
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Customer verification error:', error);
        return res.status(401).json({
            success: false,
            message: 'Invalid token',
        });
    }
};
