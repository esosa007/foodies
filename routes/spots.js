const express = require('express');
const router = express.Router();
const Spot = require('../models/spots');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { validateSpot } = require('../middlewares')


router.route('/')
    .get(catchAsync(async (req, res) => {
        const allSpots = await Spot.find({});
        res.render('foodieSpots/index', { allSpots })
    }))
    .post(validateSpot, catchAsync(async (req, res, next) => {
        const newSpot = new Spot(req.body);
        await newSpot.save();
        res.redirect(`/spots/${newSpot._id}`);
    }));


router.get('/new', (req, res) => {
    res.render('foodieSpots/new');
});


router.route('/:id')
    .get(catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const foundSpot = await Spot.findById(id).populate('reviews');
        if (!foundSpot) {
            next(new ExpressError('Spot Not Found', 404))
        } else {
            res.render('foodieSpots/show', { foundSpot });
        }
    }))
    .patch(validateSpot, catchAsync(async (req, res) => {
        const { id } = req.params;
        const foundSpot = await Spot.findByIdAndUpdate(id, req.body, { runValidators: false });
        await foundSpot.save();
        res.redirect(`/spots/${foundSpot._id}`);
    }))
    .delete(catchAsync(async (req, res) => {
        const { id } = req.params;
        const foundSpot = await Spot.findByIdAndDelete(id);
        res.redirect('/spots')
    }));

    
router.get('/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundSpot = await Spot.findById(id);
    res.render('foodieSpots/edit', { foundSpot });
}));


module.exports = router;