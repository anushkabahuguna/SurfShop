// const Review = require("../models/review");

// // creating a middleware to catch promise/async errors (All)
// // error handler takes async function as argument
// module.exports	= {
// 	asyncErrorHandler	: (fn)=>
// 		(req, res, next) =>{
// // 			this returns a thenable promise ( a promise that can use .then)
// 			Promise.resolve(fn(req, res, next))
// 			.catch(next);
// // 			views>errors page is rendered
// // 			we have a error handler function defined for above rendering
// // 			this is the default handler that comes with app.js
// 		},
	
// 	isReviewAuthor : async (req, res, next) =>{
		
// 		let review = await Review.findById(req.params.review_id);
		
// 		if(review.author.equals(req.user._id)){
// 			return next();
// 		}
		
// 			req.session.error = "You are not authorised to do that!!";
// 			return res.redirect("/");
		
// 	}
	
// }



const Review = require('../models/review');
const User = require('../models/user');
const Post = require('../models/post');

module.exports = {
	asyncErrorHandler: (fn) =>
		(req, res, next) => {
			Promise.resolve(fn(req, res, next))
						 .catch(next);
		},
	isReviewAuthor: async (req, res, next) => {
		let review = await Review.findById(req.params.review_id);
		if(review.author.equals(req.user._id)) {
			return next();
		}
		req.session.error = 'Bye bye';
		return res.redirect('/');
	},
	isLoggedIn: (req, res, next) => {
		
		if(req.isAuthenticated()){
			return next();
		}
		
		req.session.error = "You need to be logged in to do that";
		req.session.redirectTo = req.originalUrl;
// 		this above line tells the login page to take them to the original url they were trying to access
// 		but couldnt do so due to not being logged in
		res.redirect("/login");
		
	},
	
	isAuthor : async (req, res, next) => {
	
	const post = await Post.findById(req.params.id);
	if( post.author.equals(req.user._id))
		{
// 				we have to pass this in order to next function in middleware chain
			res.locals.post = post;
			return next();
		}
		
		req.session.error = "Access Denied";
		res.redirect("back");
	
	}
	
	
	
}

