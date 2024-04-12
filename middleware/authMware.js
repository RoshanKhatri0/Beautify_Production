const JWT = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        const authorizationHeader = req.headers['authorization'];
        if (!authorizationHeader) {
            return res.status(401).json({ message: 'Authorization token not provided', success: false });
        }

        const token = authorizationHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: 'Authorization token not provided', success: false });
        }

        JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) {
                console.error(err);
                return res.status(401).json({ message: 'Authentication failed', success: false });
            } else {
                req.body.userId = decode.id;
                next();
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};
