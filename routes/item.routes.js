// ---------------------
// >> BASE VARIABLES <<
// ---------------------
const express = require('express');
const {
    createItem,
    getAllItems,
    getItemByID,
    updateItem,
    deleteItem
} = require('../controllers/item.controller');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();
// ---------------------


// ---------------------
// >> ROUTES <<
// ---------------------
router.use(verifyToken); // Pipeline | All the routes that follow this will be protected
router.route('/').get(getAllItems).post(createItem);
router.route('/:id').get(getItemByID).put(updateItem).delete(deleteItem);
// ---------------------


// ---------------------
// >> EXPORTS <<
// ---------------------
module.exports = router;
// ---------------------










