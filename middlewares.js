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
    if(!req.isAuthenticated()) {
        // req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be logged in to add a new Spot!');
        return res.redirect('/users/login');
    }
    next()
};

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}