const express = require('express');
const router = express.Router();
const Ad = require('../models/Ad');
const { auth, adminOnly } = require('../middleware/auth');

// Get all ads
router.get('/', async (req, res) => {
  try {
    const ads = await Ad.find().sort({ priority: -1 });
    res.json(ads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add ad
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { name, type, admobId, platform } = req.body;

    const ad = new Ad({
      name,
      type,
      admobId,
      platform: platform || 'both'
    });

    await ad.save();
    res.status(201).json({ message: 'Ad added', ad });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete ad
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await Ad.findByIdAndDelete(req.params.id);
    res.json({ message: 'Ad deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;