require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const analyzeRoute = require('./routes/analyze');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/misinfo-db';
mongoose.connect(mongoURI)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads folder exists and serve it statically (optional depending on if we save images)
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/analyze', analyzeRoute);
app.use('/api/auth', require('./routes/auth'));

// Basic health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Misinformation Detection API is running' });
});

// History route to fetch all past analysis records
const AnalysisResult = require('./models/AnalysisResult');
app.get('/api/history', async (req, res) => {
    try {
        const history = await AnalysisResult.find().sort({ createdAt: -1 });
        res.json(history);
    } catch (error) {
        console.error("Error fetching history:", error);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
