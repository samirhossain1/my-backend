const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['banner', 'interstitial', 'rewarded'], required: true },
  admobId: { type: String, required: true },
  platform: { type: String, enum: ['android', 'ios', 'both'], default: 'both' },
  image: { type: String, default: '' },
  link: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  priority: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Ad', adSchema);