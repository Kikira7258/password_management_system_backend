// ---------------------
// >> BASE VARIABLES <<
// ---------------------
const Item = require('../models/item.model');
const Note = require('../models/note.model');
const { JSONResponse } = require('../lib/helper');
// ---------------------


// ---------------------
// >> GET ALL ITEMS <<
// ---------------------
exports.getAllItems = async (req, res) => {
    try {
        const { favorited } = req.query;

        // Use the query parameter to decide which items to retrieve
        const query = favorited === 'true' ? { favorite: true } : (favorited === 'false' ? { favorite: false } : {});

        // Retrieve items based on the query
        const item = await Item.find({...query, user_id:req.user.id}).sort({ createdAt: -1 }).populate('user_id note');

        JSONResponse.success(res, 'Success', item, 200)
    } catch(err) {
        JSONResponse.err(res, 'Failure to get all items', err, 500)
    }
}
// ---------------------


// ---------------------
// >> GET ITEM BY ID <<
// ---------------------
exports.getItemByID = async (req, res) => {
    try {
        const item = await Item.findOne({_id:req.params.id, user_id:req.user.id}).populate('user_id note');
        if(!item) throw new Error('No item found with that ID');
        JSONResponse.success(res, 'Success', item, 200);
    } catch(err) {
        JSONResponse.err(res, 'Failure to get item by ID', err, 500);
    }
}
// ---------------------


// ---------------------
// >> CREATE ITEM <<
// ---------------------
exports.createItem = async (req, res) => {
    try {
        // Create the item
        const item = new Item({...req.body, user_id:req.user.id});

        let note;
        if (req.body.note) {
        // Create a corresponding note
        note = await Note.create({
            note: req.body.note,
            item: item._id, // Reference the created item
            user_id: req.user.id
        });

        // Add the note to the item
        item.note = note._id;
        } else {
            item.note = null;
        }
        
        await item.save();
    
        JSONResponse.success(res, 'Success', { item, note }, 201);
    } catch(err) {
        JSONResponse.err(res, 'Failure to create item', err, 500);
    }
}
// ---------------------


// ---------------------
// >> UPGRADE ITEM <<
// ---------------------
exports.updateItem = async (req, res) => {
    try {
        let data = req.body;
        const item = await Item.findOne({_id:req.params.id, user_id:req.user.id});
        if(!item) throw new Error('No item found with that ID');
       

        if (data.note) {
            let note = await Note.findOneAndUpdate({_id:item.note}, {note:data.note});
            if (!note) {
                note = await Note.create({note:data.note, item: item._id, user_id: req.user.id});
            }
            data = { ...data, note: note._id };
        }

        item.set(data);
        await item.save();

        JSONResponse.success(res, 'Success', item, 200);
    } catch(err) {
        JSONResponse.err(res, 'Failure to update item', err, 500);
    }
}

// ---------------------


// ---------------------
// >> DELETE ITEM <<
// ---------------------
exports.deleteItem = async (req, res) => {
    try {
        const item = await Item.findOneAndDelete({_id:req.params.id, user_id:req.user.id});
        if(!item) throw new Error('No item found with that ID');
        JSONResponse.success(res, 'Success', item, 200);
    } catch (err) {
        JSONResponse.err(res, 'Failure to delete item', err, 500);
    }
}
// ---------------------