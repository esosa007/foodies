const express = require('express');
const app = express();
const path = require('path');
const engine = require('ejs-mate');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const spotRoutes = require('./routes/spots.js');
const reviewRoutes = require('./routes/reviews.js');
const userRoutes = require('./routes/users.js');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError.js');
const catchAsync = require('./utils/catchAsync.js');
const User = require('./models/users.js');
const passport = require('passport');
const LocalStrategy = require('passport-local');


mongoose.connect('mongodb://localhost:27017/foodies');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.engine('ejs', engine);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(methodOverride('_method'));

const sessionOptions = {
    secret: 'changethissecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
};
app.use(session(sessionOptions));
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    next()
});


app.get('/', catchAsync(async (req, res) => {
    res.render('home');
}));


app.use('/spots', spotRoutes)
app.use('/spots/:id/reviews', reviewRoutes)
app.use('/users', userRoutes);


app.all('*', (req, res, next) => {
    next(new ExpressError('Oops, Page Not Found!', 404))
});


app.use((err, req, res, next) => {
    const { status = 500, message = 'Oops, something went wrong' } = err;
    res.render('error', { status, message, err })
});


const port = 3000;
app.listen(port, (req, res) => {
    console.log(`Listening on Port ${port}`);
});