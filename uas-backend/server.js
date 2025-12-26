const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const complaintRoutes = require('./routes/complaintRoutes');

const authRoutes = require('./routes/authRoutes'); 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes); 
app.use('/api/complaints', complaintRoutes);

app.get('/', (req, res) => {
    res.send('Backend UAS Berjalan Lancar!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});