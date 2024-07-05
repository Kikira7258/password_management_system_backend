//---------------------
// >> BASE VARIABLES <<
//---------------------
const path = require('path');
const express = require('express');
const multer = require('multer');
const { rateLimit } = require('express-rate-limit');

const authController = require('../controllers/auth.controller');
const verifyToken = require('../middleware/authMiddleware');
const {registerValidator} = require('../middleware/validatorMiddleware');

const router = express.Router();

// Tells Multer where to upload the files https://www.npmjs.com/package/multer
const upload = multer({ storage: multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/uploads'))
      },

      // The name of the file to be stored
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1])
      }
}) });
//---------------------



  // Set up rate limiter: maximum of five requests every 10 minutes
  const otpLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    skipsSuccessfulRequests: true,
    keyGenerator: (req) => req.body.email,
  });

  // Set up rate limiter: maximum of five requests every 10 minutes
  const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 6,
    skipsSuccessfulRequests: true,
    keyGenerator: (req) => req.body.email,
  });
    
  // Set up rate limiter: maximum of five requests every 10 minutes
  const registerLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    skipsSuccessfulRequests: true,
    keyGenerator: (req) => req.ip,
  });



//---------------------
// >> BASE ROUTES <<
//---------------------
router.route('/login').post(loginLimiter, authController.login);
router.route('/register').post(registerValidator, registerLimiter, authController.registerProfile);
router.route('/logout').get(authController.logout);
router.route('/forgot-password').post(authController.forgotPassword);
router.route('/verify-otp').post(otpLimiter, authController.verifyOTP);
router.route('/reset-password').post(authController.resetPassword);

router.route('/change-password').post(verifyToken, authController.changePassword);

// upload.single is used to upload a single file
router.route('/profile').get(verifyToken, authController.getProfile).put(verifyToken, upload.single('profileImage'), authController.updateProfile).delete(verifyToken, authController.deleteProfile);
//---------------------



//---------------------
// >> EXPORTS <<
//---------------------
module.exports = router;
//---------------------









