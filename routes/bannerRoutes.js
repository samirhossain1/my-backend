const express = require('express');
const router = express.Router();
const Banner = require('../models/Banner');
const { auth, adminOnly } = require('../middleware/auth');

// Get all banners
router.get('/', async (req, res) => {
  try {
    const banners = await Banner.find().sort({ priority: -1 });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get home banners
router.get('/home', async (req, res) => {
  try {
    const banners = await Banner.find({ type: 'home', isActive: true }).sort({ priority: -1 });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add banner
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { title, type, image, link, priority } = req.body;

    const banner = new Banner({
      title,
      type: type || 'home',
      image,
      link: link || '',
      priority: priority || 0
    });

    await banner.save();
    res.status(201).json({ message: 'Banner added', banner });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete banner
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ message: 'Banner deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;