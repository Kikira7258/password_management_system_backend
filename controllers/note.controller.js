// ---------------------
// >> BASE VARIABLES <<
// ---------------------
const Note = require('../models/note.model');
const Item = require('../models/item.model')
const { JSONResponse } = require('../lib/helper');
// ---------------------


// ---------------------
// >> GET ALL NOTES <<
// ---------------------
exports.getAllNotes = async (req, res) => {
    try {
        // Retrieve notes, sorted by createdAt in descending order
        const notes = await Note.find({user_id:req.user.id}).sort({ createdAt: -1 }).populate('item'); // populate the 'note' with the 'item' field
        
        JSONResponse.success(res, 'Success', notes, 200);
    } catch (err) {
        JSONResponse.err(res, 'Failure to get all notes', err, 500);
    }
}
// ---------------------


// ---------------------
// >> GET NOTE <<
// ---------------------
exports.getNoteByID = async (req, res) => {
    try {
        const note = await Note.findOne({_id:req.params.id, user_id:req.user.id}).populate('item'); // populate the 'note' with the 'item' field
        if (!note) throw new Error('No note found with that ID');
        JSONResponse.success(res, 'Success', note, 200);
    } catch (err) {
        JSONResponse.err(res, 'Failure to get note by ID', err, 500);
    }
}
// ---------------------


// ---------------------
// >> CREATE NOTE <<
// ---------------------
exports.createNote = async (req, res) => {
    try {
        const note = await Note.create({...req.body, user_id:req.user.id});
        JSONResponse.success(res, 'Success', note, 200);
    } catch (err) {
        JSONResponse.err(res, 'Failure to create note', err, 500);
    }
}
// ---------------------


// ---------------------
// >> UPDATE NOTE <<
// ---------------------
exports.updateNote = async (req, res) => {
    try {
        const note = await Note.findOneAndUpdate({_id:req.params.id, user_id:req.user.id}, req.body);
        if (!note) throw new Error('No note found with that ID');
        JSONResponse.success(res, 'Success', note, 200);
    } catch (err) {
        JSONResponse.err(res, 'Failure to update note', err, 500);
    }
}
// ---------------------


// ---------------------
// >> DELETE NOTE <<
// ---------------------
exports.deleteNote = async (req, res) => {
    try {
        const note = await Note.findOneAndDelete({_id:req.params.id, user_id:req.user.id});
        if (!note) throw new Error ('No note found with that ID');
        JSONResponse.success(res, 'Success', note, 200);
    } catch (err) {
        JSONResponse.err(res, 'Failure to delete note', err, 500);
    }
}
// ---------------------