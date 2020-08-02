const express = require('express');
const router = express.Router({ mergeParams : true});
const {asyncErrorHandler, isReviewAuthor}	=	require("../middleware");
const {reviewCreate, reviewUpdate, reviewDestroy} = require("../controllers/reviews"); 

// create   /posts/:id/reviews
router.post('/', asyncErrorHandler(reviewCreate));

// update
router.put('/:review_id', isReviewAuthor, asyncErrorHandler(reviewUpdate));

// delete
router.delete('/:review_id', isReviewAuthor, asyncErrorHandler(reviewDestroy));


module.exports = router;

/*
GET 				index 				/posts
GET 				new 				/posts/new
POST 				create 				/posts
GET  				show 				/posts/:id
GET  				edit				/posts/:id/edit
PUT					update				/posts/:id
DELETE				delete				/posts/:id
*/