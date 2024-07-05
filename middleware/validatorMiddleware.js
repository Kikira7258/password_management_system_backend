const User = require('../models/user.model');

exports.registerValidator = async (req, res, next) => {
    try {
        // Extract the relevan data from the request body, including profileImage if provided
        const { email, password, confirm_password } = req.body;

        // Check if user already exists
        if (await User.findOne({ email })) {
            return res.status(400).json({
                status: 'fail',
                message: 'User already exists',
                error:{
                    email: 'User already exists'
                }
            })
        }

        // Check if password and confirmPassword match
        if (password !== confirm_password) {
            return res.status(400).json({
                status: 'fail',
                message: 'Passwords do not match',
                error:{
                    password: 'Passwords do not match'
                }
            });
        }

        next();
    } catch (error) {
        next(error);
    }
}