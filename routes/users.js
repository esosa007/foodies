const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../models/users');
const catchAsync = require('../utils/catchAsync');


router.get('/register', catchAsync(async(req, res) => {
    res.render('users/register')
}));

router.post('/', catchAsync(async(req, res, next) => {
    const newUser = new User(req.body);
    await newUser.save()
    res.redirect('/spots');
}));

router.get('/login', (req, res) => {
    res.cookie('name', 'Junior');
    res.redirect('/spots');
});


module.exports = router;