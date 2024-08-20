const express = require('express');
const app = express();
const path = require('path');
const engine = require('ejs-mate');
const { serialize } = require('v8');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const Spot = require('./models/spots.js');
const Review = require('./models/reviews.js');
const User = require('./models/users.js');
const ExpressError = require('./utils/ExpressError.js');
const catchAsync = require('./utils/catchAsync.js');
const { spotSchema } = require('./schemas.js');
const { validateSpot } = require('./middlewares.js');


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


app.get('/', catchAsync(async (req, res) => {
    res.render('home');
}));


app.get('/spots', catchAsync(async (req, res) => {
    const allSpots = await Spot.find({});
    res.render('foodieSpots/index', { allSpots })
}));


app.get('/spots/new', (req, res) => {
    res.render('foodieSpots/new');
});


app.post('/spots', validateSpot, catchAsync(async (req, res, next) => {
    const newSpot = new Spot(req.body);
    await newSpot.save();
    res.redirect(`/spots/${ newSpot._id }`);
}));


app.post('/spots/:id/reviews', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const foundSpot = await Spot.findById(id);
    const newReview = new Review(req.body);
    foundSpot.reviews.push(newReview._id)
    await newReview.save();
    await foundSpot.save();
    res.redirect(`/spots/${ foundSpot._id }`);
}));


app.get('/spots/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const foundSpot = await Spot.findById(id).populate('reviews');
    if(!foundSpot) {
        next(new ExpressError('Spot Not Found', 404))
    } else {
        res.render('foodieSpots/show', { foundSpot });
    }
}));


app.get('/spots/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundSpot = await Spot.findById(id);
    res.render('foodieSpots/edit', { foundSpot });
}));


app.patch('/spots/:id', validateSpot, catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundSpot = await Spot.findByIdAndUpdate(id, req.body, { runValidators: false });
    await foundSpot.save();
    res.redirect(`/spots/${foundSpot._id}`);
}));


app.delete('/spots/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundSpot = await Spot.findByIdAndDelete(id);
    res.redirect('/spots')
}));


app.get('/users/register', catchAsync(async(req, res) => {
    res.render('users/register')
}));


app.post('/users', catchAsync(async(req, res, next) => {
    const newUser = new User(req.body);
    await newUser.save()
    res.redirect('/spots');
}));

app.get('/users/login', (req, res) => {
    res.render('users/login')
});


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