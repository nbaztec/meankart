var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('main/auth/login', {
    user: req.session.user
  })
});

module.exports = router;
