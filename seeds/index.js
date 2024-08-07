const mongoose = require('mongoose');
const Spot = require('../models/spots.js');
const cities = require('../seeds/cities.js');
const helpers = require('../seeds/seedHelpers.js');

mongoose.connect('mongodb://localhost:27017/foodies');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedHelper = async () => {
    await Spot.deleteMany({});
    for (let i = 0; i < 20; i++) {
        const randomNum = Math.floor(Math.random() * 20);
        var spots = await new Spot({
            name: `${helpers.names[randomNum]} ${helpers.descriptors[randomNum].name}`,
            location: `${cities[randomNum].city}`,
            imageURL: `${helpers.descriptors[randomNum].image}`,
            cost: randomNum
        })
        await spots.save()
    }

};

seedHelper().then(() => {
    mongoose.connection.close();
    console.log('Connection Closed!')
});