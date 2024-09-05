const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateUser, storeReturnTo } = require('../middlewares');
const passport = require('passport');
const { createUser, loginUser, logOutUser, renderRegister, renderLogin } = require('../controllers/users');


router.get('/register', renderRegister);

router.post('/register', validateUser, createUser);

router.get('/login', renderLogin);

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/users/login'}), loginUser);

router.post('/logout', logOutUser);


module.exports = router;