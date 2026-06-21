const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: String,
        default: 'general',
        trim: true
    },
    image: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'draft'],
        default: 'active'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    views: {
        type: Number,
        default: 0
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Data', dataSchema);