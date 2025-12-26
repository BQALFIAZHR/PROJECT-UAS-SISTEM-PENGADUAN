const validateRegister = (req, res, next) => {
    const { username, password, full_name } = req.body;
    
    if (!username || !password || !full_name) {
        return res.status(400).json({ 
            message: "Semua field (username, password, full_name) wajib diisi!" 
        });
    }
    next(); 
};

module.exports = { validateRegister };