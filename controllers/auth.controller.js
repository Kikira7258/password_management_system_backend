//---------------------
// >> BASE VARIABLES <<
//---------------------
const JWT = require('jsonwebtoken');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const mailer = require('../lib/email');
//---------------------



//---------------------
// >> Login User <<
//---------------------
exports.login = async (req, res, next) => {
    try {
        const data = req.body;
        console.log(data);

        // Find user by email
        const user = await User.findOne({ email: data.email });
        
        // Check if user exists
        if (!user) {
            throw new Error('User not found');
        }

        // Verify password
        const passwordMatch = await bcrypt.compare(data.password, user.password);
        if(!passwordMatch) {
            return res.status(400).json({ error: 'Authentication failed' });
        }

        // Generate JWT token for authentication
        const token = JWT.sign({id: user._id}, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        // Exculude password from response
        user.password = undefined;

        // send success response with token and user details
        res.status(200).json({
            status: 'success',
            data: {
                token,
                user
            }
        });
    } catch (error) {
        next(error);
    }
};
//---------------------



//---------------------
// >> Create Profile <<
//---------------------
exports.registerProfile = async (req, res, next) => {
    try {
        // Extract the relevan data from the request body, including profileImage if provided
        const { first_nm, last_nm, email, password } = req.body;

        // Create a new user with the provided data
        const newProfile = await User.create({
            first_nm,
            last_nm,
            email,
            password,
            profileImage:  process.env.ORIGIN + "/default/default-profile-picture.png"  // Add profileImage to the user data.
        })

        // Exculude password from response
        newProfile.password = undefined

        // Send success response with the created user details
        res.status(201).json({
            status: 'success',
            data: {
                profile: newProfile
            }
        });
    } catch (error) {
        // Handle error if user profile creation fails
        next(error);
    }
}
//---------------------



//---------------------
// >> Forgot Password <<
//---------------------
exports.forgotPassword = async (req, res, next) => {
    try {
        // Extract the email from the request body
        const { email } = req.body;

        // Find user by email
        const user = await User.findOne({ email });

        if (user) {
            // Generate OTP code for password reset
            const otp = Math.floor(100000 + Math.random() * 900000);
            console.log(otp);
            
            // Send OTP code to user email
            // const email = await mailer.sendMail({
            //     to: user.email,
            //     subject: 'Password Reset OTP',
            //     template: 'forgot-password',
            //     data: {
            //         token: otp
            //     }
            // });
            
            // if (!email) {
            //     throw new Error('Failed to send OTP');
            // }
            
            // Save OTP code and expiry time to user document
            user.otp = otp;
            user.otp_expiry = Date.now() + 10 * 60 * 1000; // Set expiry time to 10 minutes from now
            user.otp_type = 'password_reset';
            await user.save();
            
        }

        return res.status(200).json({
            status: 'success',
            message: 'OTP sent to your email',
        });

    } catch(error) {
        // Handle any errors that might occur during the forgot password process
        next(error);
    }
}
//---------------------


//---------------------
// >> Verify OTP <<
//---------------------
exports.verifyOTP = async (req, res, next) => {
    try {
        console.log(req.body);
        // Extract the OTP code from the request body
        const { otp, email } = req.body;

        // Find the user with matching OTP and email, and ensure the OTP has not expired
        const user = await User.findOne({ otp, email, otp_expiry: { $gt: Date.now() }, otp_type: 'password_reset'});

        if (!user) {
            return res.status(400).json({
                status: 'fail',
                message: 'OTP verification failed',
            });
        } else {
            return res.status(200).json({
                status: 'success',
                message: 'OTP verified successfully',
            });
        }
    } catch(error) {
        // Handle any errors that might occur during the OTP verification process
        next(error);
    }
}

//---------------------




//---------------------
// >> Reset password <<
//---------------------
exports.resetPassword = async (req, res, next) => {
    try {
        const { email, otp, newPassword, confirmPassword } = req.body;


        // Ensure new password matches confirm password
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                status: 'fail',
                message: 'Passwords do not match'
            });
        }

        // Find the user by email and verift the OTP
        const user = await User.findOne({ email, otp, otp_type: 'password_reset' });

        if(!user) {
            return res.status(400).json({
                status: 'fail',
                message: 'OTP verification failed'
            });
        }


        // Update the user's password
        user.password = newPassword;
        user.otp = undefined; // Clear the OTP
        user.otp_expiry = undefined; // Clear the OTP expiry time
        user.otp_type = undefined;

        await user.save();


        // Send success response
        res.status(200).json({
            status: 'success',
            message: 'Password changed successfully'
        });

    } catch (error) {
        // Handle error
        next(error)
    }
};

//---------------------



//---------------------
// >> Get User by ID <<
//---------------------
exports.getProfile = async (req, res) => {
    try {
        // Find user by ID
        const user = await User.findById(req.user.id);

        // Check if user exists
        if (!user) {
            throw new Error('User not found');
        }

        // Exculude password from response
        user.password = undefined

        // send success response with user details
        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        });
    } catch (error) {
        // Handle error if user is not found
        res.status(404).json({
            status: 'fail',
            message: error.message
        });
    }
};
//---------------------



//---------------------
// >> Update profile ID <<
//---------------------
exports.updateProfile = async (req, res) => {
    try {
        // Extract the relevant data from the request body

        const data = req.body;
        if (req.file) {
            // If there is a file uploaded, add the profileImage into the data object
            data.profileImage = process.env.ORIGIN + "/uploads/" + req.file.filename;
        }




        // Update user by ID with the provided data
        const user = await User.findById(req.user.id);

        // Check if user exists
        if (!user) {
            throw new Error('User not found');
        }

        // Check if email is being changed
        if (data.email !== user.email) {
            // Check if email already exists
            const emailExists = await User.findOne({ email: data.email });
            if (emailExists) {
                throw new Error('Email already exists');
            }

            if (!data.otp) {
                // Generate OTP code for email verification
                const otp = Math.floor(100000 + Math.random() * 900000);
                
                // Send OTP code to user email
                const email = await mailer.sendMail({
                    to: data.email,
                    subject: 'Verify Email',
                    template: 'confirm-email-change',
                    data: {
                        token: otp
                    }
                });
                
                if (!email) {
                    throw new Error('Failed to send OTP');
                }
                
                // Save OTP code and expiry time to user document
                user.otp = otp;
                user.otp_expiry = Date.now() + 10 * 60 * 1000; // Set expiry time to 10 minutes from now
                user.otp_type = 'email_verification';
                await user.save(); 

                return res.status(200).json({
                    status: 'success',
                    message: 'OTP sent to your email',
                    data: {
                        otp: 'sent',
                    }
                });
            } else {
                // Verify OTP code
                const otp = data.otp;
                if (!otp) {
                    throw new Error('Invalid OTP code');
                }
                if (otp != user.otp) {
                    throw new Error('Invalid OTP code');
                }
                if (user.otp_type != 'email_verification') {
                    throw new Error('Invalid OTP code');
                }
                if (Date.now() > user.otp_expiry.getTime()) {
                    throw new Error('OTP code expired');
                }

                // Remove OTP code and expiry time from user document
                user.otp = undefined;
                user.otp_expiry = undefined;
                user.otp_type = undefined;

                // Persist data to the database
                await user.save();
            }
        }

        // Update user details
        user.set({
            first_nm: data.first_nm,
            last_nm: data.last_nm,
            email: data.email,
            profileImage: data.profileImage // Update profileImage in the user data.
        });
        await user.save();






        // Exculude password from response
        user.password = undefined

        // Send success response with the updated user details
        res.status(200).json({
            status: 'success',
            message: 'User updated successfully',
            data: {
                user,
            }
        });
    } catch (error) {
        // Handle error if user update fails
        res.status(404).json({
            status: 'fail',
            message: error.message
        });
    }
};
//---------------------


//---------------------
// >> Changed password <<
//---------------------
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        console.log();

        // Find user by ID
        const user = await User.findById(req.user.id);

        // Check if user exists
        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'User not found'
            });
        }

        // Verify the current password
        const passwordMatch = await bcrypt.compare(currentPassword, user.password);
        if (!passwordMatch) {
            return res.status(401).json({
                status: 'fail',
                message: 'Incorrect current password'
            });
        }

        // Ensure new password matches confirm password
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                status: 'fail',
                message: 'Passwords do not match'
            });
        }

        
        // Update the user's password
        user.password = newPassword;
        await user.save();

        // Send success response
        res.status(200).json({
            status: 'success',
            message: 'Password changed successfully'
        });

    } catch (error) {
        // Handle error
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while changing the password',
            error: error.message
        });
    }
};
//---------------------



//---------------------
// >> Delete User <<
//---------------------
exports.deleteProfile = async (req, res) => {
    try {
        // Find user by ID and delete
        await User.findByIdAndDelete(req.user.id);

        // Send success response after user deletion
        res.status(200).json({
            status: 'success',
            message: 'user deleted successfully',
        })
    } catch (error) {
        // Handle error if user deletion fails
        res.status(404).json({
            status: 'fail',
            message: error.message
        });
    }
};
//---------------------



//---------------------
// >> Logout Profile <<
//---------------------
exports.logout = (req, res) => {
    try {
        res.status(200).json({
            status: 'success',
            message: 'Successfully logged out',
        });
    } catch(error) {
        // Handle any errors that might occur during the logout process
        res.status(500).json({
            status: 'fail',
            message: 'An error occurred while logging out',
        })
    }
}
//---------------------
















