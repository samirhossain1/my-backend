const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const upload = require('../middleware/upload');

// ===== REGISTER WITH IMAGE UPLOAD =====
router.post('/register', upload.single('profileImage'), async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Profile image path
        let profileImage = '';
        if (req.file) {
            profileImage = `/uploads/profiles/${req.file.filename}`;
        }

        // Create user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            phone: phone || '',
            address: address || '',
            profileImage: profileImage,
            role: 'user'
        });

        await user.save();

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'mySecretKey',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                profileImage: user.profileImage,
                role: user.role,
                createdAt: user.createdAt
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===== LOGIN WITH DETAILS =====
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Update login details
        user.lastLogin = new Date();
        user.loginCount = (user.loginCount || 0) + 1;
        
        // Get device info (from request headers)
        user.deviceInfo = req.headers['user-agent'] || 'Unknown';
        user.ipAddress = req.ip || req.connection.remoteAddress || '';
        
        await user.save();

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'mySecretKey',
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                profileImage: user.profileImage,
                role: user.role,
                lastLogin: user.lastLogin,
                loginCount: user.loginCount,
                createdAt: user.createdAt
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===== GET ALL USERS (Admin Only) =====
router.get('/users', async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 });
        
        // Statistics
        const totalUsers = users.length;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayRegistrations = users.filter(u => 
            new Date(u.createdAt) >= today
        ).length;

        res.json({
            success: true,
            totalUsers,
            todayRegistrations,
            users
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===== GET USER BY ID =====
router.get('/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password');
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({
            success: true,
            user
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===== UPDATE USER PROFILE =====
router.put('/user/:id', upload.single('profileImage'), async (req, res) => {
    try {
        const { name, phone, address } = req.body;
        const updateData = { name, phone, address };
        
        if (req.file) {
            updateData.profileImage = `/uploads/profiles/${req.file.filename}`;
        }
        
        const user = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).select('-password');
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({
            success: true,
            message: 'Profile updated successfully',
            user
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===== DELETE USER (Admin Only) =====
router.delete('/user/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===== USER STATISTICS =====
router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalAdmins = await User.countDocuments({ role: 'admin' });
        const totalUsersOnly = await User.countDocuments({ role: 'user' });
        
        // Today's registrations
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayRegistrations = await User.countDocuments({
            createdAt: { $gte: today }
        });
        
        // This week registrations
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const weekRegistrations = await User.countDocuments({
            createdAt: { $gte: weekAgo }
        });
        
        // Last 10 users
        const recentUsers = await User.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(10);
        
        res.json({
            success: true,
            stats: {
                totalUsers,
                totalAdmins,
                totalUsersOnly,
                todayRegistrations,
                weekRegistrations
            },
            recentUsers
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;