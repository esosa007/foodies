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
const spotRoutes = require('./routes/spots.js');
const reviewRoutes = require('./routes/reviews.js');
const userRoutes = require('./routes/users.js');
const ExpressError = require('./utils/ExpressError.js');
const catchAsync = require('./utils/catchAsync.js');
const router = express.Router();


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