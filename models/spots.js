const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const SpotSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageURL: String,
    cost: {
        type: Number,
        required: true,
        min: 0
    }
});

SpotSchema.pre('findOneAndUpdate', function(next) {
    
    next();
});

module.exports = mongoose.model('Spot', SpotSchema);