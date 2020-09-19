var express = require('express');
var router = express.Router();

/* GET home page. 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


 GET home page. */
let user = require('../users/controllers/userController');
let timezone = require('../timezones/controllers/timezoneController');
let {isLoggedIn, isAuth} = require('../middleware/auth.js');

//router.get('/login', user.show_login);
//router.get('/signup', user.show_signup);
//router.post('/signup', user.signup);
router.post('/login', isAuth, user.login);

router.post('/user', isLoggedIn, user.signup);
router.get('/user/:email', isLoggedIn, user.user_by_email);
router.delete('/user/:email', isLoggedIn, user.delete_by_email);
router.get('/users', isLoggedIn, user.users);
//router.patch('/user/email/:email', user.patch_by_email);

router.post('/timezone', isLoggedIn, timezone.add_timezone);
router.get('/timezone/:email', isLoggedIn, timezone.timezone_by_email);
router.delete('/timezone/:email/:id', isLoggedIn, timezone.delete_by_email);
router.get('/timezones', isLoggedIn, timezone.timezones);
//router.post('/meal/:email', isLoggedIn, meal.add);
//router.get('/meals/:email', isLoggedIn, meal.meals);
//router.get('/logout', user.logout);


module.exports = router;
