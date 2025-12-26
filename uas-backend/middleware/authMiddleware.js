const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const verifyToken = (req, res, next) => {

    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        return res.status(401).json({ message: "Akses ditolak! Token tidak ada." });
    }

    const token = authHeader.split(' ')[1]; 
    if (!token) {
        return res.status(401).json({ message: "Format token salah." });
    }

    try {
        const secret = process.env.JWT_SECRET || 'kunci_rahasia_jgn_disebar'; 
        const decoded = jwt.verify(token, secret);
        req.user = decoded; 
        next(); 
    } catch (error) {
        return res.status(403).json({ message: "Token tidak valid atau expired." });
    }
};

module.exports = { verifyToken };