// ---------------------
// >> BASE VARIABLES <<
// ---------------------
const mongoose = require('mongoose');
// ---------------------


// ---------------------
// >> SCHEMA <<
// ---------------------
const itemSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    
    username: {
        type: String
    },

    password: {
        type: String
    },

    website: {type: String},

    // one to one relationship | note <=> item
    note: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Note', // Reference to the Note model
    },

    favorite: {
        type: Boolean,
        default: false
    },

     
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
    },
},
{
    timestamps: true
});
// ---------------------


// ---------------------
// >> EXPORT <<
// ---------------------
const Item = mongoose.model('Item', itemSchema);
module.exports = Item;
// ---------------------