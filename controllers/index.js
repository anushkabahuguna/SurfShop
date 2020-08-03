const User		= require("../models/user");
const passport	= require("passport");
const Post		= require("../models/post");
const mapboxToken = process.env.MAPBOX_TOKEN;

module.exports		=	{
	
// 	Get "/" index page
	
	async landingPage(req, res, next){
		const posts = await Post.find({});
// 		we will pass our posts plus our mapbox token in the index page
		res.render("index", {posts, mapboxToken, title: 'Surf Shop Home'});
		
	},
	
	
	
	
	async postRegister(req, res, next){
	
	console.log('registering user');
		const newUser = new User({
			username: req.body.username,
			email   : req.body.email,
			image	: req.body.image
		});
		
	//waits for the user to finish registering
	//await will only work with an async function	
	//we will use a middleware instead of try/catch block to handle promise/async errors 	
	await User.register( newUser,req.body.password); 
		
	res.redirect("/");
	},
	
// 	logout function
	
	postLogin(req, res, next)
	{
	passport.authenticate('local',
		{ successRedirect : "/", 
		  failureRedirect: '/login', 
		 failureFlash: true
		})(req, res, next);
// 		HERE WE PASSED (req, res, next) BECAUSE PASSPORT.AUTHNTICATE WAS USING REQ.BODY(FOR INPUTS)
// 		WE ARE DOING THIS BECAUSE NORMALLY WE WOULD PASS A SINGLE CONTROLLER LIKE ABOVE WHICH WOULD TAKE REQ RES
// 		AND RESPONSE BUT HERE THERE IS A SECOND FUNCTION DOING SO WE HAVE TO EXPLICITELY PASS THEM
	},
	getLogout(req, res, next){
		  req.logout();
		  res.redirect('/');
		}

	
};