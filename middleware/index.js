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
const {cloudinary} = require("../cloudinary");

const middleware = {
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
	
	},
	
	isValidPassword: async (req, res, next) => {
		const { user } = await User.authenticate()(req.user.username, req.body.currentPassword)
		if(user) { 
			// add user to res.locals
			res.locals.user = user;
			// go to next middleware
			next();
		} else {
			// flash an error
// 			we have to delete image here
// 			cant use this here as we are using arrow function here
// 			that is why we changes module.exports to an object so we can use its name instead of this
// 			passed req to middleware chain
			middleware.deleteProfileImage(req);
			req.session.error = 'Incorrect Current Password!';
			// short circuit the route middleware and redirect to /profile
			return res.redirect('/profile');
		}
	},
	
	changePassword: async (req, res, next) => {
		// destructure new password values from req.body object
		const { 
			newPassword,
			passwordConfirmation
		} = req.body;

		
		// check if new password values exist
// 		suppose the user does not put password confirmation then he/she will be able to submit form because that client side code is never run so here we are saving ourselves becuase if password confirmation is not set up then password will not be changed
// 		but we have to show them error to make sure they do password confirmation
		if (newPassword && !passwordConfirmation) {
			middleware.deleteProfileImage(req);
		req.session.error = 'Missing password confirmation!';
		return res.redirect('/profile');
	} else if (newPassword && passwordConfirmation) {
			// destructure user from res.locals
			const { user } = res.locals;
				// check if new passwords match
				if (newPassword === passwordConfirmation) {
					// set new password on user object
					await user.setPassword(newPassword);
					// go to next middleware
					next();
				} else {
// 					this is the third time we are checking first two :client side we are doing this in case a tech savy 
// 					person tries to submit form breaking client side code OR THEY CAN USE CURL ALSO SO WE SHOULD DO THIS...
					// flash error
					middleware.deleteProfileImage(req);
					req.session.error = 'New passwords must match!';
					// short circuit the route middleware and redirect to /profile
					return res.redirect('/profile');
				}
		} else {
			// go to next middleware
// 			the user is not trying to change password but other things
			next();
		}
	},
// 	we are doing this in case an error occurs while updating or creating a user , the image they uploaded should be deleted from cloudinary
	deleteProfileImage : async req =>{
		
		if(req.file)
			await cloudinary.v2.uploader.destroy(req.file.public_id);
		
			}
};

module.exports = middleware;

