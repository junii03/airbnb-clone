const express = require('express');
const router = express.Router();
const multer = require('multer');
const { isAdmin } = require('../middlewares/user');

const upload = multer({ dest: '/tmp' });

const {
    register,
    login,
    logout,
    googleLogin,
    uploadPicture,
    updateUserDetails,
    adminLogin,
    createAdmin,
    getAdminDashboard,
    adminRegister,
} = require('../controllers/userController');

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/google/login').post(googleLogin)
router.route('/upload-picture').post(upload.single('picture', 1), uploadPicture)
router.route('/update-user').put(updateUserDetails)
router.route('/logout').get(logout);

// Admin routes
router.route('/admin/login').post(adminLogin);
router.route('/admin/create').post(createAdmin);
router.route('/admin/register').post(adminRegister);
router.route('/admin/dashboard').get(isAdmin, getAdminDashboard);

module.exports = router;
