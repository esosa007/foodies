const Spot = require('./models/spots');
const Review = require('./models/reviews');
const { spotSchema, userSchema, reviewSchema } = require("./schemas");
const ExpressError = require("./utils/ExpressError");

module.exports.validateSpot = (req, res, next) => {
    const { error } = spotSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 500);
    } else {
        next()
    };
};

module.exports.validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        next(new ExpressError(msg, 500))
    } else {
        next()
    };
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        next(new ExpressError(msg, 500))
    } else {
        next()
    };
};

module.exports.isLoggedIn = (req, res, next) => {
    const { id } = req.params;
    if(!req.isAuthenticated()) {
        if(req.originalUrl === `/spots/${id}/reviews`) {
            req.session.returnTo = `/spots/${id}`;
            req.flash('error', 'You must be logged in to do that!');
            return res.redirect('/users/login');
        } else {
            req.session.returnTo = req.originalUrl;
            req.flash('error', 'You must be logged in to do that!');
            return res.redirect('/users/login');
        }
    }
    next()
};

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
};

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const foundSpot = await Spot.findById(id);
    if(!foundSpot.author._id.equals(req.user._id)) {
        req.flash('error', 'Sorry, you are not authorized to do that.');
        res.redirect(`/spots/${id}`);
    }
    next()
};

module.exports.isReviewAuthor = async(req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!req.user._id.equals(review.author)) {
        req.flash('error', 'You are not authorized to do that!')
        return res.redirect(`/spots/${id}`)
    }
    next()
};