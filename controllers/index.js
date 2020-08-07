const User		= require("../models/user");
const passport	= require("passport");
const Post		= require("../models/post");
const mapboxToken = process.env.MAPBOX_TOKEN;
// COMES WITH NEWER VERSIONS (INCLUDED WITH NODE NO NEED TO INSTALL)
const util = require('util');
const { cloudinary } = require("../cloudinary");
const { deleteProfileImage } = require("../middleware");

module.exports		=	{
	
// 	Get "/" index page
	
	async landingPage(req, res, next){
// 		descending order
		const posts = await Post.find({}).sort("-_id").exec();
		const recentPosts = posts.slice(0,3);
// 		we will pass our posts plus our mapbox token in the index page
		res.render("index", {posts, mapboxToken, recentPosts, title: 'Surf Shop Home'});
		
	},
	
// 	GET /register
	getRegister(req, res, next) {
	res.render('register', { title: 'Register', username: '', email: '' });
},
	
// 	async postRegister(req, res, next){
	
// 	console.log('registering user');
// // 		we put this for email if user doesnt give unique email
// 	try{
				
// 	//waits for the user to finish registering
// 	//await will only work with an async function	
// 	//we will use a middleware instead of try/catch block to handle promise/async errors 	
// 	const user = await User.register( new User(req.body), req.body.password); 
		
		
// 	req.login(user, function(err) {
// 	  if (err) { return next(err); }
// // 		we can use user also instead of newUser
// 	  req.session.success = `Welcome to Surf Shop, ${user.username}!`;
// 	  res.redirect('/');
// 	});
// 	}
// 	catch(err){
// // 		email is use or username is in use
// // 		passport handles usernmae but not email so we do ustom error message here
// 		const {username, email} = req.body;
// 		let error = err.message;
// // 		we are using same variable as error because our falsh message error is also set up like that
// 		if (error.includes('duplicate') && error.includes('index: email_1 dup key')) {
// 			error = 'A user with the given email is already registered';
// 		}
// 		res.render('register', { title: 'Register', username, email, error })
// 	}

// // 	login the user and redirect them to home page
	
		
// 	res.redirect("/");
// 	},
	
// 	SEE THE ABOVE CODE FOR EXPLANATION FOR BELOW CODE
	// POST /register
// POST /register
async postRegister(req, res, next) {
	try {
// 		check if user uploaded a profile image
		if(req.file)
			{
				const { secure_url, public_id} = req.file;
				req.body.image = { secure_url, public_id }
			}
		
		const user = await User.register(new User(req.body), req.body.password);
		req.login(user, function(err) {
			if (err) return next(err);
			req.session.success = `Welcome to Surf Shop, ${user.username}!`;
			res.redirect('/');
		});
	} catch(err) {
		deleteProfileImage(req);
		const { username, email } = req.body;
		let error = err.message;
// 		ian got this code by using locus
		if (error.includes('duplicate') && error.includes('index: email_1 dup key')) {
			error = 'A user with the given email is already registered';
		}
		res.render('register', { title: 'Register', username, email, error })
	}
},
	
	
	// 	GET /login
	getLogin(req, res, next){
// 		if user is logged in but again trying to go to login route
		if(req.isAuthenticated()){
			return res.redirect("/");
		}
		if(req.query.returnTo)
			{
				req.session.redirectTo = req.headers.referer;
			}
		
		
		res.render("login" ,{title: "Login Page"});
	},
	
	
// 	logout function
	async postLogin(req, res, next)
	{
	// passport.authenticate('local',
	// 	{ successRedirect : "/", 
	// 	  failureRedirect: '/login', 
	// 	 failureFlash: true
	// 	})(req, res, next);
// 		ABOVE WE PASSED (req, res, next) BECAUSE PASSPORT.AUTHNTICATE WAS USING REQ.BODY(FOR INPUTS)
// 		WE ARE DOING THIS BECAUSE NORMALLY WE WOULD PASS A SINGLE CONTROLLER LIKE ABOVE WHICH WOULD TAKE REQ RES
// 		AND RESPONSE BUT HERE THERE IS A SECOND FUNCTION DOING SO WE HAVE TO EXPLICITELY PASS THEM
		
// 		NOTE : USING THE BELOW UPDATED CODE
// 		req.body already has username and password from the form so we can directly assign it
		const {username, password} = req.body;
// 		this is a higher order function
// 		User.authenticate returns a function we are directly invoking  it by passing username and password
// 		this is another way of using if(err) becuase the below line will either give error or user
		const {user, error} = await User.authenticate()(username, password);
		
		if(!user && error)
			{
				return next(error);
			}
		
		req.login(user, function(err){
			if(err)
				{
					return next(err);
				}
			req.session.success = `Welcome back, ${user.username}!`;
// 			we are able to use this variable from our middleware BECAUSE THAT SESSION STILL EXISTS
			const redirectUrl = req.session.redirectTo || "/";
			delete req.session.redirectTo;
			res.redirect(redirectUrl);
			
		});
		
	},
	getLogout(req, res, next){
		  req.logout();
		  res.redirect('/');
		},
	
	async getProfile(req, res, next){
// 		we just want first 10 posts
		const posts = await Post.find({ author : req.user._id}).limit(10).exec();
		res.render("profile", {posts, title: "User Profile"});
	},
	
// 	async updateProfile(req, res, next) {
// 		// destructure username and email from req.body
// 		const {
// 			username,
// 			email
// 		} = req.body;
// 		// destructure user object from res.locals
// // 		comes from middlweare chain had to make it local to access it anywhere in middleware chain
// 		const { user } = res.locals;
// 		// check if username or email need to be updated
// 		if (username) user.username = username;
// 		if (email) user.email = email;
// 		if(req.file) {
// // 			check if a profile image exists then delete it
// 			if(user.image.secure_url) await cloudinary.v2.uploader.destroy(user.image.public_id);
// 			const { secure_url, public_id} = req.file;
			
// 			user.image = { secure_url, public_id };
			
// 		}
// 		// save the updated user to the database
// 		await user.save();
// 		// promsify req.login
// // 		we have to login the user back with new password
// // 		this passport method(req.login) requires a callback function but we are using async/await so we use util here to help us convert this in a promise
// // 		here .bind(req) acts like .bind(this) , we do this to make sure that req.login has access to req object for logging in
// // 		if we dont then we get saveuninitialized error 
// 		const login = util.promisify(req.login.bind(req));
// 		// log the user back in with new info
// 		await login(user);
// 		// redirect to /profile with a success flash message
// 		req.session.success = 'Profile successfully updated!';
// 		res.redirect('/profile');
// 	}
	
	
	
	async updateProfile(req, res, next) {
	const {
		username,
		email
	} = req.body;
	const { user } = res.locals;
	if (username) user.username = username;
	if (email) user.email = email;
	if (req.file) {
		if (user.image.public_id) await cloudinary.v2.uploader.destroy(user.image.public_id);
		const { secure_url, public_id } = req.file;
		user.image = { secure_url, public_id };
	}
	await user.save();
	const login = util.promisify(req.login.bind(req));
	await login(user);
	req.session.success = 'Profile successfully updated!';
	res.redirect('/profile');
}

	
};






