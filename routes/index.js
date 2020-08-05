const express 	= require('express');
const router	= express.Router();

// controller
const 
{landingPage, postRegister, postLogin, getLogout, getLogin, getRegister, getProfile, updateProfile }	= require("../controllers/index");
// using error middleware
// js knows and looks for a file name with index we can do it for controllers above also
const { 
	asyncErrorHandler,
	isLoggedIn,
	isValidPassword,
	changePassword
} = require('../middleware');

/* GET home/landing page. */
router.get('/', asyncErrorHandler(landingPage));

/* GET /register */
router.get('/register',getRegister);

/* post /register */
router.post('/register',asyncErrorHandler(postRegister));

/* GET /login */
router.get('/login',getLogin);

/* POST /login */
router.post('/login', asyncErrorHandler(postLogin));

// logout 
router.get('/logout', getLogout);

/* GET /profile */
router.get('/profile', isLoggedIn, asyncErrorHandler(getProfile));

/* update /profile */
/* PUT /profile */
router.put('/profile',
	isLoggedIn,
	asyncErrorHandler(isValidPassword),
	asyncErrorHandler(changePassword),
	asyncErrorHandler(updateProfile)
);
/* GET /forgotpassword */
router.get('/forgot', (req, res, next) => {
  res.send("reached login page");
});

/* GET /forgotpassword */
router.put('/forgot', (req, res, next) => {
  res.send("reached login page");
});

/* GET /resetpassword */
router.get('/reset/:token', (req, res, next) => {
  res.send("reached login page");
});
/* GET /resetpassword */
router.put('/reset/:token', (req, res, next) => {
  res.send("reached login page");
});














module.exports = router;
