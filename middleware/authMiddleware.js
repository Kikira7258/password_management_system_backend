// ---------------------
// >> BASE VARIABLES <<
// ---------------------
const jwt = require('jsonwebtoken');
function verifyToken(req, res, next) {
    const token = req.header('authorization');

    if (!token) return res.status(401).json({ error: 'Access Denied' });
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();        
    } catch {
        res.status(401).json({ error: 'Invalid Token' });
    }
}

module.exports = verifyToken;
// ---------------------






















