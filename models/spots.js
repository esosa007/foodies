const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Review = require('./reviews');



const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200');
});



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
    images: [ImageSchema],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
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