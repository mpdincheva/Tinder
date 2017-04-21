var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.post('/login',
  passport.authenticate('local', {failureRedirect: '/login'}), 
  function(req, res, next) {
    // console.log(req.user);
    res.cookie('userid', req.user._id);
    res.json(req.user);
  }
);


module.exports = router;
