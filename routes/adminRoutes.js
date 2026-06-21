const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth, adminOnly } = require('../middleware/auth');

// ===== DASHBOARD STATS =====
router.get('/dashboard', auth, adminOnly, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalAdmins = await User.countDocuments({ role: 'admin' });
        const totalUsersOnly = await User.countDocuments({ role: 'user' });
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayRegistrations = await User.countDocuments({
            createdAt: { $gte: today }
        });
        
        res.json({
            totalUsers,
            totalAdmins,
            totalUsersOnly,
            todayRegistrations
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===== ALL USERS WITH DETAILS =====
router.get('/users', auth, adminOnly, async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 });
        
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===== UPDATE USER ROLE =====
router.put('/users/:id/role', auth, adminOnly, async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password');
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({ message: 'User role updated', user });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ===== BLOCK/UNBLOCK USER =====
router.patch('/users/:id/block', auth, adminOnly, async (req, res) => {
    try {
        const { isBlocked } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isBlocked },
            { new: true }
        ).select('-password');
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({
            message: `User ${isBlocked ? 'blocked' : 'unblocked'}`,
            user
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ===== DELETE USER =====
router.delete('/users/:id', auth, adminOnly, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;