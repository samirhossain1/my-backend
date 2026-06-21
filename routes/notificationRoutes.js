const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { auth, adminOnly } = require('../middleware/auth');

// Get all notifications
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ sentAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send notification
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { title, message, type } = req.body;

    const notification = new Notification({
      title,
      message,
      type: type || 'general'
    });

    await notification.save();
    res.status(201).json({ message: 'Notification sent', notification });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete notification
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notification deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;