const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['match_start', 'breaking_news', 'general', 'promotion'], default: 'general' },
  channelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel' },
  targetUsers: { type: [String], default: [] },
  isRead: { type: Boolean, default: false },
  sentAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);