var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {

  res.render('main/index', {
    title: 'Global Site'
  })
});

router.use('/home', require('./home'));
router.use('/auth', require('./auth'));

module.exports = router;
