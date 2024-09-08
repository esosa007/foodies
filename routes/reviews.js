const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor, storeReturnTo } = require('../middlewares');
const { createReview, deleteReview } = require('../controllers/reviews');


router.post('/', isLoggedIn, validateReview, createReview);

router.delete('/:reviewId',  isLoggedIn, isReviewAuthor, deleteReview);


module.exports = router;