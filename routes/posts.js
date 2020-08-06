const express = require('express');
const router = express.Router();
const multer = require("multer");
const { storage } = require('../cloudinary');
const upload = multer({ storage : storage}); 
// this storage helps to upload automatically without using cloudinary v2.upload sentence
const {asyncErrorHandler, isLoggedIn, isAuthor }	=	require("../middleware");
const { postIndex,
	   postNew, 
	   postCreate, 
	   postShow, 
	   postEdit,
	   postUpdate,
	   postDestroy
	}	=	require("../controllers/posts");

// get posts index /posts
router.get('/', asyncErrorHandler(postIndex));

// /posts/new
// here we dont have error handler function becuase this function does not use asynce if error occurs then its 
// handled by the error handler in app.js(see at last).
router.get('/new', isLoggedIn, postNew);

// create   /posts
router.post('/', isLoggedIn , upload.array("images", 4),  asyncErrorHandler(postCreate));

// show  /posts/:id
router.get('/:id',asyncErrorHandler(postShow));

// edit
router.get('/:id/edit', isLoggedIn, asyncErrorHandler(isAuthor), postEdit);
// update
router.put('/:id', isLoggedIn, asyncErrorHandler(isAuthor), upload.array("images", 4), asyncErrorHandler(postUpdate));

// delete
router.delete('/:id', isLoggedIn, asyncErrorHandler(isAuthor), asyncErrorHandler(postDestroy));



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