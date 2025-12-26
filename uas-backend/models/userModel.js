const db = require('../config/database');

const UserModel = {
 
    findByUsername: async (username) => {
        const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        return rows[0];
    },

 
    create: async (username, password, fullName, role) => {
        const [result] = await db.execute(
            'INSERT INTO users (username, password, full_name, role) VALUES (?, ?, ?, ?)',
            [username, password, fullName, role]
        );
        return result;
    }
};

module.exports = UserModel;