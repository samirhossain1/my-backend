const mongoose = require('mongoose');

const streamSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  channelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true },
  streamUrl: { type: String, required: true },
  backupUrl: { type: String, default: '' },
  quality: { type: String, enum: ['360p', '480p', '720p', '1080p'], default: '720p' },
  status: { type: String, enum: ['scheduled', 'live', 'completed', 'cancelled'], default: 'scheduled' },
  scheduledTime: { type: Date },
  startTime: { type: Date },
  endTime: { type: Date },
  viewerCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Stream', streamSchema);