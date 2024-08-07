const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ReviewSchema = new Schema({
    review: String,
    rating: Number
});

module.exports = mongoose.model('Review', ReviewSchema);