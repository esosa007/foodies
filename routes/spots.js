const express = require('express');
const router = express.Router();
const { validateSpot, isLoggedIn, isAuthor } = require('../middlewares');
const { renderAllSpots, createSpot, renderNew, renderSpot, updateSpot, deleteSpot, renderEdit } = require('../controllers/spots');


router.route('/')
    .get(renderAllSpots)
    .post(isLoggedIn, validateSpot, createSpot);


router.get('/new', isLoggedIn, renderNew);


router.route('/:id')
    .get(renderSpot)
    .put(isLoggedIn, isAuthor, validateSpot, updateSpot)
    .delete(isLoggedIn, isAuthor, deleteSpot);

    
router.get('/:id/edit', isLoggedIn, isAuthor, renderEdit);


module.exports = router;