const express = require('express');
const router = express.Router();
const Data = require('../models/Data');
const { auth, adminOnly } = require('../middleware/auth');

// ===== CREATE DATA =====
router.post('/', auth, adminOnly, async (req, res) => {
    try {
        const { title, content, category, image, status } = req.body;
        
        const data = new Data({
            title,
            content,
            category: category || 'general',
            image: image || '',
            status: status || 'active',
            createdBy: req.user.id
        });
        
        await data.save();
        
        res.status(201).json({
            success: true,
            message: 'Data created successfully',
            data
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===== GET ALL DATA =====
router.get('/', async (req, res) => {
    try {
        const { category, limit = 50, page = 1 } = req.query;
        
        const query = { status: 'active' };
        if (category) query.category = category;
        
        const skip = (page - 1) * limit;
        
        const data = await Data.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('createdBy', 'name email');
        
        const total = await Data.countDocuments(query);
        
        res.json({
            success: true,
            data,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===== GET SINGLE DATA =====
router.get('/:id', async (req, res) => {
    try {
        const data = await Data.findById(req.params.id)
            .populate('createdBy', 'name email');
        
        if (!data) {
            return res.status(404).json({ error: 'Data not found' });
        }
        
        res.json({
            success: true,
            data
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===== UPDATE DATA =====
router.put('/:id', auth, adminOnly, async (req, res) => {
    try {
        const { title, content, category, image, status } = req.body;
        
        const data = await Data.findByIdAndUpdate(
            req.params.id,
            { title, content, category, image, status },
            { new: true }
        );
        
        if (!data) {
            return res.status(404).json({ error: 'Data not found' });
        }
        
        res.json({
            success: true,
            message: 'Data updated successfully',
            data
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===== DELETE DATA =====
router.delete('/:id', auth, adminOnly, async (req, res) => {
    try {
        const data = await Data.findByIdAndDelete(req.params.id);
        
        if (!data) {
            return res.status(404).json({ error: 'Data not found' });
        }
        
        res.json({
            success: true,
            message: 'Data deleted successfully'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===== GET CATEGORIES =====
router.get('/categories/all', async (req, res) => {
    try {
        const categories = await Data.distinct('category');
        res.json({
            success: true,
            categories
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;