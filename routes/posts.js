const express = require('express');
const router = express.Router();

// get posts index /posts
router.get('/', (req, res, next) => {
  res.send("reached");
});

// /posts/new
router.get('/new', (req, res, next) => {
  res.send("reached");
});

// create   /posts
router.post('/', (req, res, next) => {
  res.send("reached");
});

// show  /posts/:id
router.get('/:id', (req, res, next) => {
  res.send("reached");
});

// edit
router.get('/:id/edit', (req, res, next) => {
  res.send("reached");
});
// update
router.put('/:id', (req, res, next) => {
  res.send("reached");
});

// delete
router.delete('/:id', (req, res, next) => {
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