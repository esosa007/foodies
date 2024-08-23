const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Review = require('./reviews');
const reviews = require('./reviews');

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
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

SpotSchema.post('findOneAndDelete', async(spot) => {
    if(spot.reviews.length) {
        const res = await Review.deleteMany({ _id: { $in: spot.reviews}});
    }
}); 

module.exports = mongoose.model('Spot', SpotSchema);