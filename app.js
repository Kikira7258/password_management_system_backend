// ---------------------
// >> BASE VARIABLES <<
// ---------------------
const express = require('express');
const cors = require('cors');
const app = express();
// ---------------------


// ---------------------
// >> ROUTERS <<
// ---------------------
const noteRouter = require('./routes/note.routes');
const itemRouter = require('./routes/item.routes');
const authRouter = require('./routes/auth.routes');
// ---------------------


// ---------------------
// >> MIDDLEWARE <<
// ---------------------
app.use(cors("*"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allows files to be serve from the server (Any static files)
app.use(express.static('public'));
// ---------------------


// ---------------------
// >> ROUTES <<
// ---------------------
app.use('/api/v1/note', noteRouter);
app.use('/api/v1/item', itemRouter);
app.use('/api/v1/auth', authRouter);
// ---------------------


// ---------------------
// >> ERROR HANDLING <<
// ---------------------
app.all("*", (req, res, next) => next(new Error('Page Not Found')));
app.use((err,req,res,next) => {
    console.log(err);
    res.status(500).json({
        message: err.message || "Internal Server Error",
    })
})
// ---------------------


// ---------------------
// >> ERROR HANDLING <<
// ---------------------
module.exports = app
// ---------------------