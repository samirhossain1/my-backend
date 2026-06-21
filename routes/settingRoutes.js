const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');
const { auth, adminOnly } = require('../middleware/auth');

// Get all settings
router.get('/', async (req, res) => {
  try {
    const settings = await Setting.find();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update setting
router.put('/:key', auth, adminOnly, async (req, res) => {
  try {
    const { value } = req.body;
    const setting = await Setting.findOneAndUpdate(
      { key: req.params.key },
      { value },
      { new: true, upsert: true }
    );
    res.json({ message: 'Setting updated', setting });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Version check
router.get('/version/check', async (req, res) => {
  try {
    const version = await Setting.findOne({ key: 'appVersion' });
    const forceUpdate = await Setting.findOne({ key: 'forceUpdate' });
    const maintenance = await Setting.findOne({ key: 'maintenanceMode' });

    res.json({
      version: version?.value || '1.0.0',
      forceUpdate: forceUpdate?.value || false,
      maintenance: maintenance?.value || false
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;