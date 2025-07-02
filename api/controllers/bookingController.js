const Booking = require('../models/Booking');

// Books a place
exports.createBookings = async (req, res) => {
    try {
        const userData = req.user;
        const { place, checkIn, checkOut, numOfGuests, name, phone, price } =
            req.body;

        const booking = await Booking.create({
            user: userData.id,
            place,
            checkIn,
            checkOut,
            numOfGuests,
            name,
            phone,
            price,
        });

        res.status(200).json({
            booking,
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal server error',
            error: err,
        });
    }
};

// Returns user specific bookings (customers only)
exports.getBookings = async (req, res) => {
    try {
        const userData = req.user;
        if (!userData) {
            return res
                .status(401)
                .json({ error: 'You are not authorized to access this page!' });
        }

        // Prevent admins from accessing customer booking endpoints
        if (userData.isAdmin && userData.role === 'admin') {
            return res.status(403).json({
                error: 'Admin users should use admin endpoints',
            });
        }

        const booking = await Booking.find({ user: userData.id }).populate('place');

        res.status(200).json({
            booking,
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal server error',
            error: err,
        });
    }
};

// Returns all bookings (admin only)
exports.getAllBookings = async (req, res) => {
    try {
        const userData = req.user;

        if (!userData || !userData.isAdmin || userData.role !== 'admin') {
            return res.status(403).json({
                error: 'Admin access required',
            });
        }

        const bookings = await Booking.find({})
            .populate('place')
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            bookings,
            total: bookings.length,
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal server error',
            error: err,
        });
    }
};
