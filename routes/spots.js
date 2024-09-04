const express = require('express');
const router = express.Router();
const Spot = require('../models/spots');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { validateSpot, isLoggedIn } = require('../middlewares')


router.route('/')
    .get(catchAsync(async (req, res) => {
        const allSpots = await Spot.find({});
        res.render('foodieSpots/index', { allSpots })
    }))
    .post(validateSpot, catchAsync(async (req, res, next) => {
        const newSpot = new Spot(req.body);
        await newSpot.save();
        req.flash('success', 'You successfully created a new Spot!')
        res.redirect(`/spots/${newSpot._id}`);
    }));


router.get('/new', isLoggedIn, (req, res) => {
    res.render('foodieSpots/new');
});


router.route('/:id')
    .get(catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const foundSpot = await Spot.findById(id).populate('reviews');
        if (!foundSpot) {
            req.flash('error', 'Oops, Spot not found!')
            res.redirect('/spots')
            //next(new ExpressError('Spot Not Found', 404))
        } else {
            res.render('foodieSpots/show', { foundSpot });
        }
    }))
    .patch(validateSpot, isLoggedIn, catchAsync(async (req, res) => {
        const { id } = req.params;
        const foundSpot = await Spot.findByIdAndUpdate(id, req.body, { runValidators: false });
        await foundSpot.save();
        req.flash('success', 'You successfully modified a Spot!')
        res.redirect(`/spots/${foundSpot._id}`);
    }))
    .delete(isLoggedIn, catchAsync(async (req, res) => {
        const { id } = req.params;
        const foundSpot = await Spot.findByIdAndDelete(id);
        req.flash('success', 'You successfully deleted a Spot!')
        res.redirect('/spots')
    }));

    
router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundSpot = await Spot.findById(id);
    res.render('foodieSpots/edit', { foundSpot });
}));


module.exports = router;