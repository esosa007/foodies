const Spot = require('../models/spots');
const Review = require('../models/reviews');
const catchAsync = require('../utils/catchAsync');

module.exports.createReview = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const foundSpot = await Spot.findById(id);
    const newReview = new Review(req.body);
    newReview.author = req.user._id;
    foundSpot.reviews.push(newReview._id);
    await newReview.save();
    await foundSpot.save();
    res.redirect(`/spots/${ foundSpot._id }`);
});

module.exports.deleteReview = catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    const spot = await Spot.findByIdAndUpdate(id, { $pull: { reviews: reviewId }});
    const review = await Review.findByIdAndDelete(reviewId);
    res.redirect(`/spots/${ spot._id }`);
});