const express = require('express');
const router = express.Router({ mergeParams : true});

// home page index /posts/:id/reviews
router.get('/', (req, res, next) => {
  res.send("reached");
});

// /posts/:id/reviews/new
// router.get('/new', (req, res, next) => {
//   res.send("reached");
// });

// create   /posts/:id/reviews
router.post('/', (req, res, next) => {
  res.send("reached");
});

// show  /posts/:id/reviews/:id
router.get('/:review_id', (req, res, next) => {
  res.send("reached");
});

// edit
router.get('/review_:id/edit', (req, res, next) => {
  res.send("reached");
});
// update
router.put('/:review_id', (req, res, next) => {
  res.send("reached");
});

// delete
router.delete('/:review_id', (req, res, next) => {
  res.send("reached");
});



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