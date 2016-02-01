var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('main/products', {
    title: 'Products',
    user: req.session.user
  })
});

module.exports = router;
