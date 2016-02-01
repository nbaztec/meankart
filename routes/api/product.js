var express = require('express');
var router = express.Router();
var validator = require('validator');
var redis = require('../../config/redis');
var _ = require('lodash');

var amqpClient = require('../../modules/amqp-client')({
  host: 'amqp://localhost'
});
var client = amqpClient.client('meankart.product');

router.get('/', function(req, res, next) {
  res.status(200).json({'message': 'OK'});
});

router.post('/list', function(req, res, next) {

  if (req.body.password !== req.body.password_confirm) return res.json({code: 400, error: 'passwords do not match'});
  
  client.send('list', {
    page: req.body.page
  })
    .then(function(result) {
      res.json(result);
    }).catch(function(err) {
      res.json({code:500, error: 'An error occurred'});
    });
});

module.exports = router;
