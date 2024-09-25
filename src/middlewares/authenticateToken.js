const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // 'Bearer TOKEN_HERE'

    if (!token) {
        return res.status(401).send("Access Denied: No token provided.");
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send("Invalid token.");
        }

        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
