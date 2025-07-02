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

// Admin-only routes for accommodation management
router.route('/admin/add').post(isAdmin, addPlace);
router.route('/admin/list').get(isAdmin, userPlaces);
router.route('/admin/update').put(isAdmin, updatePlace);
router.route('/admin/:id/delete').delete(isAdmin, deletePlace);

// Photo upload routes
router.post('/upload', upload.array('photos', 20), uploadPhotos);
router.post('/upload-by-link', uploadPhotoByLink);

module.exports = router;
