const express = require('express');
const router = express.Router({ mergeParams: true });
const Spot = require('../models/spots');
const Review = require('../models/reviews');
const catchAsync = require('../utils/catchAsync');
const { validateReview, isLoggedIn } = require('../middlewares');


router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const foundSpot = await Spot.findById(id);
    const newReview = new Review(req.body);
    foundSpot.reviews.push(newReview._id);
    await newReview.save();
    await foundSpot.save();
    res.redirect(`/spots/${ foundSpot._id }`);
}));


router.delete('/:reviewId', isLoggedIn, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    const spot = await Spot.findByIdAndUpdate(id, { $pull: { reviews: reviewId }});
    const review = await Review.findByIdAndDelete(reviewId);
    res.redirect(`/spots/${ spot._id }`);
}));


module.exports = router;