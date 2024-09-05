const User = require('../models/users');
const catchAsync = require('../utils/catchAsync');


module.exports.renderRegister = (req, res) => {
    res.render('users/register')
};

module.exports.createUser = catchAsync(async(req, res, next) => {
    const { username, email, password } = req.body;
    try {
        const newUser = new User({ username, email });
        const registerUser = await User.register(newUser, password);
        req.flash('success', `Welcome to Foodies ${registerUser.username}!`);
        req.login(registerUser, function(err) {
            if (err) {
                return next(err);
            }
            res.redirect('/spots');
          });
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('/users/register');
    }
});

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
};

module.exports.loginUser = (req, res) => {
    const { username } = req.body;
    req.flash('success', `Welcome back ${username}`);
    // const redirectUrl = res.locals.returnTo || '/campgrounds';
    // delete req.session.returnTo;
    // res.redirect(redirectUrl);
    res.redirect('/spots');
};

module.exports.logOutUser = (req, res, next) => {
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!')
        res.redirect('/spots');
      });
};