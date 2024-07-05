//---------------------
// >> BASE VARIABLES <<
//---------------------
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//---------------------



//---------------------
// >> User Schema <<
//---------------------
const userSchema = new mongoose.Schema({
    first_nm: {
        type: String,
        required: [true, 'First name is required'],
    },

    last_nm: {
        type: String,
        required: [true, 'Last name is required'],
    },
    
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },

    password: {
        type: String,
        required: [true, 'Password is required'],
    },

    // Add a new field for file
    profileImage: {
        type: String 
    },

    otp: {
        type: Number
    },
    otp_expiry: {
        type: Date
    },
    otp_type: {
        type: String
    }
})
//---------------------



//---------------------
// >> Proctect conditions <<
//---------------------
userSchema.pre('save', async function(next) {
    try {
        // Hash the password before saving the user
        if (this.isModified('password') || this.isNew) {
            const hashedPassword = await bcrypt.hash(this.password, 10);
            this.password = hashedPassword;
        }
        next();

    } catch (error) {
        next(error);
    }
});
//---------------------



//---------------------
// >> Export Module <<
//---------------------
module.exports = mongoose.model('User', userSchema);
//---------------------















