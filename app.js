require("dotenv").config();

const createError			 = require("http-errors");
const express				 = require("express");
const engine				 = require("ejs-mate");
const path					 = require("path");
const favicon				 = require("serve-favicon");
const cookieParser			 = require("cookie-parser");
const logger				 = require("morgan");
const bodyParser			 = require("body-parser");
const passport				 = require("passport");
const passporLocalMongoose	 = require("passport-local-mongoose");
const User 					 = require("./models/user");
const session				 = require("express-session");
const mongoose				 = require("mongoose");
const methodOverride		 = require("method-override");


// require routes
const indexRouter 			 =require('./routes/index');
const posts 				 =require('./routes/posts');
const reviews 				 =require('./routes/reviews');

const app = express();

// connect to the database port for mongodb is 27017
mongoose.connect("mongodb://localhost:27017/surf-shop", { useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
 console.log("connected to database");
});

// use ejs locals for all ejs templates
app.engine("ejs", engine);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride("_method"));

// configure passport and sessions
app.use(session({
  secret: 'tazo buzo',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// CHANGE: USE "createStrategy" INSTEAD OF "authenticate"
// before bracket part comes from passport and the bracket part comes from passport local mongoose

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// title middleware we have to place it before any of the routes run 
// this also inludes our error and success locals
app.use(function(req, res, next){
	
// 	set default page title
	res.locals.title = "Surf Shop";
	
// 	set success flash message
	res.locals.success = req.session.success || "";
	delete req.session.success;
	
// 	set error flash message
	res.locals.error = req.session.error || "";
	delete req.session.error;
	
// 	continue to the next function in middleware chain
// 	imp to put next()
	next();
});

// mount routes
app.use('/', indexRouter);
app.use("/posts", posts);
app.use("/posts/:id/reviews", posts);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // // render the error page
  // res.status(err.status || 500);
  // res.render('error');
	
	console.log(err);
	req.session.error = err.message;
	res.redirect("back");
});



module.exports = app;
