const jwt = require('jsonwebtoken');
const auth = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header) {
        return res.status(401).json({
            message: 'Không có token'
        });
    }
    const token = header.split(' ')[1];
    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'secretkey123'
        );
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({
            message: 'Token không hợp lệ'
        });
    }
};

module.exports = auth;