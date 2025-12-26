const express = require('express');
const router = express.Router();
const ComplaintController = require('../controllers/complaintController');
const { verifyToken } = require('../middleware/authMiddleware');


console.log('--- Complaint Routes Loaded ---');

router.post('/', verifyToken, ComplaintController.createComplaint);
router.get('/my', verifyToken, ComplaintController.getMyComplaints);
router.get('/:id', verifyToken, ComplaintController.getDetail);

router.put('/:id', verifyToken, ComplaintController.updateComplaint);

router.get('/admin/all', verifyToken, ComplaintController.getAllComplaints);
router.post('/admin/process/:id', verifyToken, ComplaintController.processComplaint);
router.get('/public/news', verifyToken, ComplaintController.getNews);

module.exports = router;