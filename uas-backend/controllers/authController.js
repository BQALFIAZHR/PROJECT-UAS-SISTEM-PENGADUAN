const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const AuthController = {

    register: async (req, res) => {
        try {
            const { username, password, full_name, role } = req.body;

   
            const existingUser = await UserModel.findByUsername(username);
            if (existingUser) {
                return res.status(400).json({ message: "Username sudah dipakai" });
            }

         
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const userRole = role || 'mahasiswa';
            await UserModel.create(username, hashedPassword, full_name, userRole);

            res.status(201).json({ message: "Registrasi berhasil, silakan login" });

        } catch (error) {
            res.status(500).json({ message: "Server Error", error: error.message });
        }
    },

 
    login: async (req, res) => {
        try {
            const { username, password } = req.body;


            const user = await UserModel.findByUsername(username);
            if (!user) {
                return res.status(404).json({ message: "User tidak ditemukan" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Password salah" });
            }

            const token = jwt.sign(
                { id: user.id, role: user.role }, 
                process.env.JWT_SECRET, 
                { expiresIn: '1d' } 
            );

            res.json({ 
                message: "Login berhasil", 
                token: token,
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role
                }
            });

        } catch (error) {
            res.status(500).json({ message: "Server Error", error: error.message });
        }
    }
};

module.exports = AuthController;