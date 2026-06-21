const express = require('express');
const router = express.Router();
const Stream = require('../models/Stream');
const { auth, adminOnly } = require('../middleware/auth');

// Get all streams
router.get('/', async (req, res) => {
  try {
    const streams = await Stream.find().populate('channelId', 'name logo').sort({ createdAt: -1 });
    res.json(streams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get live streams
router.get('/live', async (req, res) => {
  try {
    const streams = await Stream.find({ status: 'live' }).populate('channelId', 'name logo');
    res.json(streams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add stream
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { title, description, channelId, streamUrl, backupUrl, quality } = req.body;

    const stream = new Stream({
      title,
      description: description || '',
      channelId,
      streamUrl,
      backupUrl: backupUrl || '',
      quality: quality || '720p',
      status: 'live'
    });

    await stream.save();
    res.status(201).json({ message: 'Stream added', stream });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete stream
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await Stream.findByIdAndDelete(req.params.id);
    res.json({ message: 'Stream deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;