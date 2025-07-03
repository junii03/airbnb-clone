const express = require('express');
const router = express.Router();
const { isLoggedIn, isAdmin } = require('../middlewares/user');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const {
    addPlace,
    getPlaces,
    updatePlace,
    singlePlace,
    userPlaces,
    searchPlaces,
    deletePlace,
    uploadPhotos,
    uploadPhotoByLink
} = require('../controllers/placeController');

// Public routes
router.route('/').get(getPlaces);
router.route('/:id').get(singlePlace);
router.route('/search/:key').get(searchPlaces);

// User routes for their own accommodations
router.route('/user/add').post(isLoggedIn, addPlace);
router.route('/user/list').get(isLoggedIn, userPlaces);
router.route('/user/update').put(isLoggedIn, updatePlace);

// Admin routes for viewing all accommodations and management
router.route('/admin/list').get(isAdmin, userPlaces);
router.route('/admin/:id/delete').delete(isAdmin, deletePlace);

// Photo upload routes (available to logged-in users)
router.post('/upload', isLoggedIn, upload.array('photos', 20), uploadPhotos);
router.post('/upload-by-link', isLoggedIn, uploadPhotoByLink);

module.exports = router;
