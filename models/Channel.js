const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String, default: '' },
  category: { type: String, enum: ['Sports', 'News', 'Entertainment', 'Music', 'Movies', 'Kids', 'Documentary', 'Other'], required: true },
  streamUrl: { type: String, required: true },
  backupUrl: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  quality: { type: String, enum: ['360p', '480p', '720p', '1080p', '4K'], default: '720p' },
  viewerCount: { type: Number, default: 0 },
  isLive: { type: Boolean, default: false },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Channel', channelSchema);