const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();

// ===== MIDDLEWARE =====
app.use(cors({
    origin: '*',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== STATIC FILES (Images) =====
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===== MONGODB CONNECTION =====
const MONGODB_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/myDatabase';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected Successfully!'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// ===== ROUTES =====
app.get('/', (req, res) => {
    res.send('🚀 Backend is running!');
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/channels', require('./routes/channelRoutes'));
app.use('/api/streams', require('./routes/streamRoutes'));
app.use('/api/banners', require('./routes/bannerRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/ads', require('./routes/adRoutes'));
app.use('/api/settings', require('./routes/settingRoutes'));
app.use('/api/data', require('./routes/dataRoutes'));

// ===== SERVER START =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});