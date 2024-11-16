const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: [String], // Array of tags
    images: [String] // Array to hold up to 10 image URLs
}, { timestamps: true });

module.exports = mongoose.model('Car', CarSchema);
