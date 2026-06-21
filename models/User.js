const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        default: ''
    },
    profileImage: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    lastLogin: {
        type: Date,
        default: null
    },
    loginCount: {
        type: Number,
        default: 0
    },
    deviceInfo: {
        type: String,
        default: ''
    },
    ipAddress: {
        type: String,
        default: ''
    },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel'
    }],
    watchHistory: [{
        channelId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Channel'
        },
        watchedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);