const express = require('express');
const router = express.Router();
const Channel = require('../models/Channel');
const { auth, adminOnly } = require('../middleware/auth');

// Get all channels
router.get('/', async (req, res) => {
  try {
    const channels = await Channel.find().sort({ createdAt: -1 });
    res.json(channels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get active channels
router.get('/active', async (req, res) => {
  try {
    const channels = await Channel.find({ isActive: true }).sort({ name: 1 });
    res.json(channels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add channel
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { name, category, streamUrl, backupUrl, quality, logo } = req.body;

    const channel = new Channel({
      name,
      category,
      streamUrl,
      backupUrl: backupUrl || '',
      quality: quality || '720p',
      logo: logo || '',
      addedBy: req.user.id
    });

    await channel.save();
    res.status(201).json({ message: 'Channel added', channel });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Toggle channel
router.patch('/:id/toggle', auth, adminOnly, async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) return res.status(404).json({ error: 'Channel not found' });

    channel.isActive = !channel.isActive;
    await channel.save();

    res.json({ message: `Channel ${channel.isActive ? 'ON' : 'OFF'}`, channel });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete channel
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await Channel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Channel deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;