const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../models/users');
const catchAsync = require('../utils/catchAsync');
const { validateUser } = require('../middlewares');
const passport = require('passport');


router.get('/register', (req, res) => {
    res.render('users/register')
});

router.post('/register', validateUser, catchAsync(async(req, res, next) => {
    const { username, email, password } = req.body;
    try {
        const newUser = new User({ username, email });
        const registerUser = await User.register(newUser, password);
        req.flash('success', `Welcome to Foodies ${registerUser.username}!`)
        res.redirect('/spots');
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('/users/register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/users/login'}), async(req, res) => {
    const { username } = req.body;
    req.flash('success', `Welcome back ${username}`);
    res.redirect('/spots');
});

router.post('/logout', async(req, res, next) => {
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!')
        res.redirect('/spots');
      });
});


module.exports = router;