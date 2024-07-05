// ---------------------
// >> BASE VARIABLES <<
// ---------------------
require('dotenv').config();

const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 3000;
// ---------------------


// ---------------------
// >> START EXPRESS APP <<
// ---------------------
mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("MongoDB Connected Successfully!"))
    .catch(error => console.log(error));
// ---------------------


// ---------------------
// >> PORT <<
// ---------------------
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
// ---------------------