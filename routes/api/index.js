var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.status(200).json({'message': 'OK'});
});

router.use('/user', require('./user'));
router.use('/product', require('./product'));

module.exports = router;
