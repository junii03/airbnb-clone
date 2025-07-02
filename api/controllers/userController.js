const User = require('../models/User');
const cookieToken = require('../utils/cookieToken');
const bcrypt = require('bcryptjs')
const cloudinary = require('cloudinary').v2;


// Register/SignUp user
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Name, email and password are required',
            });
        }

        // check if user is already registered
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                message: 'User already registered!',
            });
        }

        user = await User.create({
            name,
            email,
            password,
        });

        // after creating new user in DB send the token
        cookieToken(user, res);
    } catch (err) {
        res.status(500).json({
            message: 'Internal server Error',
            error: err,
        });
    }
};

// Login/SignIn user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // check for presence of email and password
        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required!',
            });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(400).json({
                message: 'User does not exist!',
            });
        }

        // match the password
        const isPasswordCorrect = await user.isValidatedPassword(password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: 'Email or password is incorrect!',
            });
        }

        // Generate token
        const token = user.getJwtToken();

        // Set cookie options
        const options = {
            expires: new Date(Date.now() + process.env.COOKIE_TIME * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: false, // Set to false for local development
            sameSite: 'lax'
        };

        // Remove password from user object
        user.password = undefined;

        res.status(200)
            .cookie("token", token, options)
            .json({
                success: true,
                message: 'User logged in successfully',
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role || 'user',
                    isAdmin: user.isAdmin || false
                }
            });

    } catch (err) {
        console.error('User login error:', err);
        res.status(500).json({
            message: 'Internal server Error',
            error: err.message || 'Unknown error',
        });
    }
};

// Google Login
exports.googleLogin = async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400), json({
                message: 'Name and email are required'
            })
        }

        // check if user already registered
        let user = await User.findOne({ email });

        // If the user does not exist, create a new user in the DB
        if (!user) {
            user = await User.create({
                name,
                email,
                password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10)
            })
        }

        // send the token
        cookieToken(user, res)
    } catch (err) {
        res.status(500).json({
            message: 'Internal server Error',
            error: err,
        });
    }
}

// Upload picture
exports.uploadPicture = async (req, res) => {
    const { path } = req.file
    try {
        let result = await cloudinary.uploader.upload(path, {
            folder: 'Airbnb/Users',
        });
        res.status(200).json(result.secure_url)
    } catch (error) {
        res.status(500).json({
            error,
            message: 'Internal server error',
        });
    }
}

// update user
exports.updateUserDetails = async (req, res) => {
    try {
        const { name, password, email, picture } = req.body

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404), json({
                message: 'User not found'
            })
        }

        // user can update only name, only password,only profile pic or all three

        user.name = name
        if (picture && !password) {
            user.picture = picture
        } else if (password && !picture) {
            user.password = password
        } else {
            user.picture = picture
            user.password = password
        }
        const updatedUser = await user.save()
        cookieToken(updatedUser, res)
    } catch (error) {
        res.status(500).json({ message: "Internal server error" }, error)
    }
}

// Logout
exports.logout = async (req, res) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: true,   // Only send over HTTPS
        sameSite: 'none' // Allow cross-origin requests
    });
    res.status(200).json({
        success: true,
        message: 'Logged out',
    });
};

// Admin Login
exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // check for presence of email and password
        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required!',
            });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(400).json({
                message: 'Admin account does not exist!',
            });
        }

        // Check if user is admin
        if (!user.isAdmin || user.role !== 'admin') {
            return res.status(403).json({
                message: 'Access denied. Admin privileges required!',
            });
        }

        // match the password
        const isPasswordCorrect = await user.isValidatedPassword(password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: 'Email or password is incorrect!',
            });
        }

        // Generate token
        const token = user.getJwtToken();

        // Set cookie options
        const options = {
            expires: new Date(Date.now() + process.env.COOKIE_TIME * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: false, // Set to false for local development
            sameSite: 'lax'
        };

        // Remove password from user object
        user.password = undefined;

        res.status(200)
            .cookie("token", token, options)
            .json({
                success: true,
                message: 'Admin logged in successfully',
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isAdmin: user.isAdmin
                }
            });

    } catch (err) {
        console.error('Admin login error:', err);
        res.status(500).json({
            message: 'Internal server Error',
            error: err.message || 'Unknown error',
        });
    }
};

// Create Admin Account (Super admin only)
exports.createAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Name, email and password are required',
            });
        }

        // check if user is already registered
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                message: 'User already exists!',
            });
        }

        user = await User.create({
            name,
            email,
            password,
            role: 'admin',
            isAdmin: true
        });

        res.status(201).json({
            success: true,
            message: 'Admin account created successfully',
            admin: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal server Error',
            error: err,
        });
    }
};

// Admin Registration without Key Validation
exports.adminRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Name, email, and password are required',
            });
        }

        // Check if user is already registered
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                message: 'User already exists with this email!',
            });
        }

        // Create admin user
        user = await User.create({
            name,
            email,
            password,
            role: 'admin',
            isAdmin: true
        });

        res.status(201).json({
            success: true,
            message: 'Admin account created successfully',
            admin: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal server Error',
            error: err,
        });
    }
};

// Get admin dashboard data
exports.getAdminDashboard = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalAdmins = await User.countDocuments({ role: 'admin' });

        // Import models to get counts
        const Place = require('../models/Place');
        const Booking = require('../models/Booking');

        const totalPlaces = await Place.countDocuments();
        const totalBookings = await Booking.countDocuments();

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalAdmins,
                totalPlaces,
                totalBookings
            }
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal server Error',
            error: err,
        });
    }
};
