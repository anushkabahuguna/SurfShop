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
	}
}