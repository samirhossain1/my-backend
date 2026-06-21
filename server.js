const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');  // ✅ Add this
require('dotenv').config();
const path = require('path');

const app = express();

// ✅ Enable CORS - Frontend ko allow karo
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/myDatabase')
  .then(() => console.log('✅ MongoDB Connected Successfully!'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Test Route
app.get('/', (req, res) => {
  res.send('🚀 IPTV Backend is running!');
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/channels', require('./routes/channelRoutes'));
app.use('/api/streams', require('./routes/streamRoutes'));
app.use('/api/banners', require('./routes/bannerRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/ads', require('./routes/adRoutes'));
app.use('/api/settings', require('./routes/settingRoutes'));

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});