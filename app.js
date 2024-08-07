const express = require('express');
const app = express();
const path = require('path');
const engine = require('ejs-mate');
const { serialize } = require('v8');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const Spot = require('./models/spots.js');
const ExpressError = require('./utils/ExpressError.js');
const catchAsync = require('./utils/catchAsync.js');

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


const verifyPassword = (req, res, next) => {
    const { password } = req.query;
    if(password !== 'hotdog') {
        throw new ExpressError('Invalid Password', 401)
    }
    next();
};


app.get('/', async (req, res) => {
    res.render('home');
});


app.get('/spots', async (req, res) => {
    const allSpots = await Spot.find({});
    res.render('foodieSpots/index', { allSpots })
});


app.get('/spots/new', verifyPassword, (req, res) => {
    res.render('foodieSpots/new');
});


app.post('/spots', catchAsync(async (req, res, next) => {
        const { name, location, imageURL, cost } = req.body;
        const newSpot = new Spot({ name, location, imageURL, cost });
        await newSpot.save();
        res.redirect(`/spots/${ newSpot._id }`);
}));


app.get('/spots/:id', async (req, res, next) => {
    const { id } = req.params;
    const foundSpot = await Spot.findById(id);
    if(!foundSpot) {
        next(new ExpressError('Not Found', 404))
    }
    res.render('foodieSpots/show', { foundSpot })
});


app.get('/spots/:id/edit', async (req, res) => {
    const { id } = req.params;
    const foundSpot = await Spot.findById(id);
    res.render('foodieSpots/edit', { foundSpot });
});


app.patch('/spots/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const { name, location, cost } = req.body;
    const foundSpot = await Spot.findByIdAndUpdate(id, { name, location, cost });
    foundSpot.save()
    res.redirect('/spots')
}));


app.delete('/spots/:id', async (req, res) => {
    const { id } = req.params;
    const foundSpot = await Spot.findByIdAndDelete(id);
    res.redirect('/spots')
});


app.get('/users/register', (req, res) => {
    res.render('users/register')
});


app.get('/users/login', (req, res) => {
    res.render('users/login')
});

app.get('/error', (req, res) => {
    chicken.fly();
})

app.get('*', (req, res) => {
    res.redirect('/spots')
});


app.use((err, req, res, next) => {
    const { status = 500, message = 'Generic Error' } = err;
    console.log(err)
    res.status(status).send(message)
});


const port = 3000;
app.listen(port, (req, res) => {
    console.log(`Listening on Port ${port}`);
});