const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true
    },
    s3Key: {
        type: String,
        required: true
    },
    bucket: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    contentType: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
