const db = require('../config/database');

const ComplaintModel = {
    
    getByUserId: async (userId) => {
        const query = `
            SELECT c.*, cat.name as category_name 
            FROM complaints c
            JOIN categories cat ON c.category_id = cat.id
            WHERE c.user_id = ?
            ORDER BY c.id DESC
        `;
        const [rows] = await db.execute(query, [userId]);
        return rows;
    },

   
    getById: async (id, userId) => {
        const query = `
            SELECT c.*, cat.name as category_name 
            FROM complaints c
            JOIN categories cat ON c.category_id = cat.id
            WHERE c.id = ? AND c.user_id = ?
        `;
        const [rows] = await db.execute(query, [id, userId]);
        return rows[0]; 
    },


    create: async (data) => {
        const query = `
            INSERT INTO complaints 
            (user_id, category_id, ticket_number, title, description, report_date, status) 
            VALUES (?, ?, ?, ?, ?, ?, 'pending')
        `;
        const [result] = await db.execute(query, [
            data.user_id, 
            data.category_id, 
            data.ticket_number, 
            data.title, 
            data.description, 
            data.report_date
        ]);
        return result;
    },


    update: async (id, data) => {
        const query = `
            UPDATE complaints 
            SET category_id = ?, title = ?, description = ?, report_date = ?
            WHERE id = ?
        `;
        const [result] = await db.execute(query, [
            data.category_id, 
            data.title, 
            data.description, 
            data.report_date,
            id
        ]);
        return result;
    },
     
    getAllAdmin: async () => {
        const query = `
            SELECT c.*, u.full_name as reporter_name, cat.name as category_name 
            FROM complaints c
            JOIN users u ON c.user_id = u.id
            JOIN categories cat ON c.category_id = cat.id
            ORDER BY FIELD(c.status, 'pending', 'proses', 'selesai'), c.report_date DESC
        `;
  
        const [rows] = await db.execute(query);
        return rows;
    },


    updateStatus: async (id, status, response, evidence) => {
        const query = `
            UPDATE complaints 
            SET status = ?, response_message = ?, evidence_photo = ?, resolved_at = NOW()
            WHERE id = ?
        `;
        const [result] = await db.execute(query, [status, response, evidence, id]);
        return result;
    },

    getPublicNews: async () => {
        const query = `
            SELECT c.*, u.full_name as reporter_name, cat.name as category_name 
            FROM complaints c
            JOIN users u ON c.user_id = u.id
            JOIN categories cat ON c.category_id = cat.id
            WHERE c.status = 'selesai' 
            AND cat.name = 'Fasilitas Rusak'
            ORDER BY c.resolved_at DESC
        `;
        const [rows] = await db.execute(query);
        return rows;
    }
};

module.exports = ComplaintModel;