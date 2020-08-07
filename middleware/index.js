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
const mbxGeocoding  	= require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken	    = process.env.MAPBOX_TOKEN;
const geocodingClient   = mbxGeocoding({ accessToken: mapboxToken });
function escapeRegExp(str) {
// 	place \ before all special characters 
// 	eg $texas - \$texas
// 	properly query the mongodb

  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

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
		
		if(req.file) await cloudinary.v2.uploader.destroy(req.file.public_id);
		
	},
	
	// create a async middleware method named searchAndFilterPosts
async searchAndFilterPosts(req, res, next) {
	// pull keys from req.query (if there are any) and assign them 
	// to queryKeys variable as an array of string values
	const queryKeys = Object.keys(req.query);
	/* 
		check if queryKeys array has any values in it
		if true then we know that req.query has properties
		which means the user:
		a) clicked a paginate button (page number)
		b) submitted the search/filter form
		c) both a and b
	*/
	if (queryKeys.length) {
		// initialize an empty array to store our db queries (objects) in
		const dbQueries = [];
		// destructure all potential properties from req.query
		let { search, price, avgRating, location, distance  } = req.query;
		// check if search exists, if it does then we know that the user
		// submitted the search/filter form with a search query
		if (search) {
			// convert search to a regular expression and 
			// escape any special characters
			search = new RegExp(escapeRegExp(search), 'gi');
			// create a db query object and push it into the dbQueries array
			// now the database will know to search the title, description, and location
			// fields, using the search regular expression
			dbQueries.push({ $or: [
				{ title: search },
				{ description: search },
				{ location: search }
			]});
		}
		// check if location exists, if it does then we know that the user
		// submitted the search/filter form with a location query
		if (location) {
			let coordinates;
// 			try{
// // 				location can be empty or have a value searched or have an array of coordinates(geocoding)
// 				location = JSON.parse(location);
// // 				this convertes "[-97.55,36.66]" into an actual array [-97.55,36.66]
// // 				BUT IF USER SEARCHES FOR A VALUE THEN THIS THING WILL THROW ERROR AND GO TO NORMAL SEARCHING EG FOR
// // 				SEARCHING "DALLAS , TEXAS" CANT BE CONVERTED INTO ARRAY
				
// 				coordinates = location;
				
// 			}
// 			catch(err)
// 				{
// 					// geocode the location to extract geo-coordinates (lat, lng)
// 					const response = await geocodingClient
// 					.forwardGeocode({
// 						  query: location,
// 						  limit: 1
// 					 })
// 					.send();
// 					// destructure coordinates [ <longitude> , <latitude> ]
// 				coordinates  = response.body.features[0].geometry.coordinates;	
// 				}
			

			try {
			  if(typeof JSON.parse(location) === 'number') {
				throw new Error;
			  }
			  location = JSON.parse(location);
			  coordinates = location;
			} catch(err) {
			  const response = await geocodingClient
				.forwardGeocode({
				  query: location,
				  limit: 1
				})
				.send();
			  coordinates = response.body.features[0].geometry.coordinates;
			}
			
			
			
			
			// get the max distance or set it to 25 mi
			let maxDistance = distance || 25;
			// we need to convert the distance to meters, one mile is approximately 1609.34 meters
			maxDistance *= 1609.34;
			// create a db query object for proximity searching via location (geometry)
			// and push it into the dbQueries array
			dbQueries.push({
			  geometry: {
			    $near: {
			      $geometry: {
			        type: 'Point',
			        coordinates
			      },
			      $maxDistance: maxDistance
			    }
			  }
			});
		}
		// check if price exists, if it does then we know that the user
		// submitted the search/filter form with a price query (min, max, or both)
		if (price) {
			/*
				check individual min/max values and create a db query object for each
				then push the object into the dbQueries array
				min will search for all post documents with price
				greater than or equal to ($gte) the min value
				max will search for all post documents with price
				less than or equal to ($lte) the min value
			*/
			if (price.min) dbQueries.push({ price: { $gte: price.min } });
			if (price.max) dbQueries.push({ price: { $lte: price.max } });
		}
		// check if avgRating exists, if it does then we know that the user
		// submitted the search/filter form with a avgRating query (0 - 5 stars)
		if (avgRating) {
			// create a db query object that finds any post documents where the avgRating
			// value is included in the avgRating array (e.g., [0, 1, 2, 3, 4, 5])
			dbQueries.push({ avgRating: { $in: avgRating } });
		}

		// pass database query to next middleware in route's middleware chain
		// which is the postIndex method from /controllers/postsController.js
		res.locals.dbQuery = dbQueries.length ? { $and: dbQueries } : {};
	}
	// pass req.query to the view as a local variable to be used in the searchAndFilter.ejs partial
	// this allows us to maintain the state of the searchAndFilter form
	res.locals.query = req.query;

	// build the paginateUrl for paginatePosts partial
	// first remove 'page' string value from queryKeys array, if it exists
	queryKeys.splice(queryKeys.indexOf('page'), 1);
	/*
		now check if queryKeys has any other values, if it does then we know the user submitted the search/filter form
		if it doesn't then they are on /posts or a specific page from /posts, e.g., /posts?page=2
		we assign the delimiter based on whether or not the user submitted the search/filter form
		e.g., if they submitted the search/filter form then we want page=N to come at the end of the query string
		e.g., /posts?search=surfboard&page=N
		but if they didn't submit the search/filter form then we want it to be the first (and only) value in the query string,
		which would mean it needs a ? delimiter/prefix
		e.g., /posts?page=N
		*N represents a whole number greater than 0, e.g., 1
	*/
	const delimiter = queryKeys.length ? '&' : '?';
	// build the paginateUrl local variable to be used in the paginatePosts.ejs partial
	// do this by taking the originalUrl and replacing any match of ?page=N or &page=N with an empty string
	// then append the proper delimiter and page= to the end
	// the actual page number gets assigned in the paginatePosts.ejs partial
	res.locals.paginateUrl = req.originalUrl.replace(/(\?|\&)page=\d+/g, '') + `${delimiter}page=`;
	// move to the next middleware (postIndex method)
	next();
}
	
	
};

module.exports = middleware;



















