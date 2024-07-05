// ---------------------
// >> BASE VARIABLES <<
// ---------------------
const mongoose = require('mongoose');
// ---------------------


// ---------------------
// >> SCHEMA <<
// ---------------------
const noteSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [
             function() {
                return !this.item;
            },
            'Title is required',
        ],
    },

    note: {
        type: String,
        required: [true, 'Note is required'],
    },
    
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item', // Reference to the Item model
    },

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the Item model
    },
},
{
    timestamps: true
});
// ---------------------


// ---------------------
// >> EXPORT <<
// ---------------------
const Note = mongoose.model('Note', noteSchema);
module.exports = Note;
// ---------------------








