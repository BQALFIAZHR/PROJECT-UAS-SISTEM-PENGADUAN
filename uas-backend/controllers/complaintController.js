const ComplaintModel = require('../models/complaintModel');

const ComplaintController = {
 
    createComplaint: async (req, res) => {
        try {
            const { category_id, title, description, report_date } = req.body;
            
            const ticket_number = Math.floor(1000 + Math.random() * 9000); 

            const newComplaint = {
                user_id: req.user.id,
                category_id,
                ticket_number,
                title,
                description,
                report_date
            };

            await ComplaintModel.create(newComplaint);
            res.status(201).json({ 
                message: "Pengaduan berhasil dikirim!", 
                ticket: ticket_number 
            });
        } catch (error) {
            res.status(500).json({ message: "Gagal membuat pengaduan", error: error.message });
        }
    },

    
    getMyComplaints: async (req, res) => {
        try {
            const data = await ComplaintModel.getByUserId(req.user.id);
            res.json(data);
        } catch (error) {
            res.status(500).json({ message: "Gagal mengambil data" });
        }
    },

    getDetail: async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            
            console.log(`Mencari complaint ID: ${id} untuk User: ${userId}`);

            const data = await ComplaintModel.getById(id, userId);
            
            if (!data) {
                return res.status(404).json({ message: "Pengaduan tidak ditemukan" });
            }
            res.json(data);
        } catch (error) {
            console.error("Error Detail:", error);
            res.status(500).json({ message: "Server Error saat ambil detail" });
        }
    },

    updateComplaint: async (req, res) => {
        try {
            const { id } = req.params;
            await ComplaintModel.update(id, req.body);
            res.json({ message: "Berhasil update data" });
        } catch (error) {
            res.status(500).json({ message: "Gagal update data" });
        }
    },

    getAllComplaints: async (req, res) => {
        try {
           
            if (req.user.role !== 'admin') {
                return res.status(403).json({ message: "Akses Ditolak! Khusus Admin." });
            }
            const data = await ComplaintModel.getAllAdmin();
            res.json(data);
        } catch (error) {
            res.status(500).json({ message: "Gagal ambil data admin" });
        }
    },

   
    processComplaint: async (req, res) => {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({ message: "Akses Ditolak!" });
            }

            const { id } = req.params;
            const { status, response_message, evidence_photo } = req.body;

            await ComplaintModel.updateStatus(id, status, response_message, evidence_photo);
            res.json({ message: "Status berhasil diperbarui!" });
        } catch (error) {
            res.status(500).json({ message: "Gagal update status" });
        }
    },

    getNews: async (req, res) => {
        try {
            const data = await ComplaintModel.getPublicNews();
            res.json(data);
        } catch (error) {
            res.status(500).json({ message: "Gagal memuat berita" });
        }
    }
};

module.exports = ComplaintController;