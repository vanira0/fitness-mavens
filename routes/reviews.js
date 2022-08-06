const express = require('express');
const router = express.Router({ mergeParams: true });

const Review = require('../models/review');

const { reviewSchema } = require('../schemas.js');

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isReviewAuthor, validateReview } = require('../middleware');


router.get('/', catchAsync(async (req, res) => {
    const reviews = await Review.find({}).populate('author');
    res.render('review/show', { reviews });
}));

router.get('/new',isLoggedIn, (req, res) => {
    res.render('review/new');
});

router.post('/',isLoggedIn, validateReview, catchAsync(async (req, res) => {
    if (!req.body.review) throw new ExpressError('Invalid Review Data', 400);
    const review = new Review(req.body.review);
    review.author = req.user._id
    await review.save();
    req.flash('success', 'Successfully review posted!');
    res.redirect('/reviews');
}));

router.get('/:id/edit',isLoggedIn,isReviewAuthor, catchAsync(async (req, res) => {
    const review = await Review.findById(req.params.id);
    if (!review) {
        req.flash('error', 'Cannot find what you are looking for!');
        return res.redirect('/reviews');
    }
    res.render('review/edit', { review });
}));

router.put('/:id',isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const review = await Review.findByIdAndUpdate(id, { ...req.body.review });
    req.flash('success', 'Successfully updated review!');
    res.redirect('/reviews');
}));

router.delete('/:id',isLoggedIn,isReviewAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Review.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted review')
    res.redirect('/reviews');
}));


module.exports = router;