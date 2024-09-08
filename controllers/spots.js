const Spot = require('../models/spots');
const catchAsync = require('../utils/catchAsync');

module.exports.renderAllSpots = catchAsync(async (req, res) => {
    const allSpots = await Spot.find({});
    res.render('foodieSpots/index', { allSpots })
});

module.exports.createSpot = catchAsync(async (req, res, next) => {
    const newSpot = new Spot(req.body);
    newSpot.author = req.user._id;
    console.log(newSpot)
    await newSpot.save();
    req.flash('success', 'You successfully created a new Spot!')
    res.redirect(`/spots/${newSpot._id}`);
});

module.exports.renderNew = (req, res) => {
    res.render('foodieSpots/new');
};

module.exports.renderSpot = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const foundSpot = await Spot.findById(id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        })
        .populate('author');
    if (!foundSpot) {
        req.flash('error', 'Oops, Spot not found!')
        res.redirect('/spots')
        //next(new ExpressError('Spot Not Found', 404))
    } else {
        res.render('foodieSpots/show', { foundSpot });
    }
});

module.exports.updateSpot = catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundSpot = await Spot.findByIdAndUpdate(id, req.body, { runValidators: false });
    await foundSpot.save();
    req.flash('success', 'You successfully modified a Spot!')
    res.redirect(`/spots/${foundSpot._id}`);
});

module.exports.deleteSpot = catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundSpot = await Spot.findByIdAndDelete(id);
    req.flash('success', 'You successfully deleted a Spot!')
    res.redirect('/spots')
});

module.exports.renderEdit = catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundSpot = await Spot.findById(id);
    res.render('foodieSpots/edit', { foundSpot });
});