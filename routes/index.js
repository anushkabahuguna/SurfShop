const express 	= require('express');
const router	= express.Router();

// controller
const {postRegister, postLogin, getLogout }	= require("../controllers/index");
// using error middleware
// js knows and looks for a file name with index we can do it for controllers above also
const {errorHandler}	= require("../middleware");

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Surf Shop Home' });
});

/* GET /register */
router.get('/register', (req, res, next) => {
  res.send("reached register page");
});

/* post /register */
router.post('/register', errorHandler(postRegister));

/* GET /login */
router.get('/login', (req, res, next) => {
  res.send("reached login page");
});

/* POST /login */
router.post('/login', postLogin);

// logout 
router.get('/logout', getLogout);

/* GET /profile */
router.get('/profile',(req, res, next) => {
  res.send("reached profile page");
});

/* update /profile */
router.put('/profile/user_id', (req, res, next) => {
  res.send("reached login page");
});

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
