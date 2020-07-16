const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Surf Shop Home' });
});

/* GET /register */
router.get('/register', (req, res, next) => {
  res.send("reached register page");
});

/* post /register */
router.post('/register', (req, res, next) => {
  res.send("reached register page");
});

/* GET /login */
router.get('/login', (req, res, next) => {
  res.send("reached login page");
});

/* POST /login */
router.post('/login', (req, res, next) => {
  res.send("reached login page");
});

/* GET /profile */
router.get('/profile', (req, res, next) => {
  res.send("reached login page");
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
