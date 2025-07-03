const Place = require('../models/Place');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const axios = require('axios');

// Adds a place in the DB
exports.addPlace = async (req, res) => {
    try {
        const userData = req.user;
        const {
            title,
            address,
            addedPhotos,
            description,
            perks,
            extraInfo,
            maxGuests,
            price,
        } = req.body;
        const place = await Place.create({
            owner: userData.id,
            title,
            address,
            photos: addedPhotos,
            description,
            perks,
            extraInfo,
            maxGuests,
            price,
        });
        res.status(200).json({
            place,
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal server error',
            error: err,
        });
    }
};

// Returns user specific places or all places for admin
exports.userPlaces = async (req, res) => {
    try {
        const userData = req.user;

        console.log('Places request from user:', userData.email, 'isAdmin:', userData.isAdmin, 'role:', userData.role);

        // If user is admin, return all places with owner details for management
        if (userData.isAdmin && userData.role === 'admin') {
            const allPlaces = await Place.find()
                .populate('owner', 'name email')
                .sort({ createdAt: -1 });
            console.log('Found', allPlaces.length, 'places for admin');
            return res.status(200).json({
                success: true,
                places: allPlaces,
                total: allPlaces.length
            });
        }

        // For regular users, return only their own places
        const userPlaces = await Place.find({ owner: userData.id })
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            places: userPlaces,
            total: userPlaces.length
        });
    } catch (err) {
        console.error('Error in userPlaces controller:', err);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message,
        });
    }
};

// Updates a place (only owner can update their own place)
exports.updatePlace = async (req, res) => {
    try {
        const userData = req.user;
        const userId = userData.id;
        const {
            id,
            title,
            address,
            addedPhotos,
            description,
            perks,
            extraInfo,
            maxGuests,
            price,
        } = req.body;

        const place = await Place.findById(id);

        if (!place) {
            return res.status(404).json({
                message: 'Place not found',
            });
        }

        // Only the owner can update their place
        if (userId !== place.owner.toString()) {
            return res.status(403).json({
                message: 'You can only update your own accommodations',
            });
        }

        place.set({
            title,
            address,
            photos: addedPhotos,
            description,
            perks,
            extraInfo,
            maxGuests,
            price,
        });

        await place.save();
        res.status(200).json({
            success: true,
            message: 'Place updated successfully!',
            place
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal server error',
            error: err,
        });
    }
};

// Returns all the places in DB
exports.getPlaces = async (req, res) => {
    try {
        const places = await Place.find();
        res.status(200).json({
            places,
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal server error',
        });
    }
};

// Returns single place, based on passed place id
exports.singlePlace = async (req, res) => {
    try {
        const { id } = req.params;
        const place = await Place.findById(id).populate('owner', '_id name email');
        if (!place) {
            return res.status(400).json({
                message: 'Place not found',
            });
        }
        res.status(200).json({
            place,
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal server error',
        });
    }
};

// Search Places in the DB
exports.searchPlaces = async (req, res) => {
    try {
        const searchword = req.params.key;

        if (searchword === '') return res.status(200).json(await Place.find())

        const searchMatches = await Place.find({ address: { $regex: searchword, $options: "i" } })

        res.status(200).json(searchMatches);
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Internal serever error 1',
        });
    }
}

// Delete a place (Admin only)
exports.deletePlace = async (req, res) => {
    try {
        const { id } = req.params;
        const place = await Place.findById(id);

        if (!place) {
            return res.status(404).json({
                message: 'Place not found',
            });
        }

        await Place.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: 'Place deleted successfully',
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal server error',
            error: err,
        });
    }
};

// Upload multiple photos to Cloudinary
exports.uploadPhotos = async (req, res) => {
    try {
        const uploadedFiles = req.files;
        const urls = [];
        for (const file of uploadedFiles) {
            const result = await cloudinary.uploader.upload(file.path, { folder: 'airbnb-clone' });
            urls.push(result.secure_url);
            fs.unlinkSync(file.path); // remove temp file
        }
        res.json(urls);
    } catch (err) {
        res.status(500).json({ message: 'Cloudinary upload failed', error: err.toString() });
    }
};

// Upload photo by link to Cloudinary
exports.uploadPhotoByLink = async (req, res) => {
    const { link } = req.body;
    try {
        const response = await axios.get(link, { responseType: 'arraybuffer' });
        const tempPath = `uploads/${Date.now()}.jpg`;
        fs.writeFileSync(tempPath, response.data);
        const result = await cloudinary.uploader.upload(tempPath, { folder: 'airbnb-clone' });
        fs.unlinkSync(tempPath);
        res.json(result.secure_url);
    } catch (err) {
        res.status(500).json({ message: 'Cloudinary upload by link failed', error: err.toString() });
    }
};
