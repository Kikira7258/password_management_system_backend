// ---------------------
// >> BASE VARIABLES <<
// ---------------------
const express = require('express');
const {
    createNote,
    getAllNotes,
    getNoteByID,
    updateNote,
    deleteNote
} = require('../controllers/note.controller');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();
// ---------------------


// ---------------------
// >> ROUTERS <<
// ---------------------
router.use(verifyToken); // Pipeline | All the routes that follow this will be protected
router.route('/').get(getAllNotes).post(createNote);
router.route('/:id').get(getNoteByID).put(updateNote).delete(deleteNote);
// ---------------------


// ---------------------
// >> BASE VARIABLES <<
// ---------------------
module.exports = router;
// ---------------------








