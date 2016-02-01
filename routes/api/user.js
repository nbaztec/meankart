var express = require('express');
var router = express.Router();
var validator = require('validator');
var redis = require('../../config/redis');
var _ = require('lodash');

var amqpClient = require('../../modules/amqp-client')({
  host: 'amqp://localhost'
});
var client = amqpClient.client('meankart.user');

router.get('/', function(req, res, next) {
  res.status(200).json({'message': 'OK'});
});

router.post('/session', function(req, res, next) {
  var r = req.body || {};
  
  if (r.destroy) {
    var token = req.session.user;
    redis().del('auth:' + token, function(){
      delete req.session.user;
      res.json({code: 200});
    });
  } else {
    res.json(req.session.user || null);
  }
  
});

router.post('/authenticate', function(req, res, next) {
  client.send('authenticate', req.body)
    .then(function(result) {
      // Set session token
      if (result.code == 200) {
        result.token = result.user._id;
        
        console.log(result.user);
        console.log(JSON.stringify(result.user));
        var client = redis();
        client.set('auth:' + result.token, JSON.stringify(result.user));
        client.expire('auth:' + result.token, 24*3600);
        req.session.user = result.token;
      }
      
      res.json(result);
    }).catch(function(err) {
      console.log(err);
      res.json({code:500, error: 'An error occurred'});
    });
});

router.post('/create', function(req, res, next) {

  if (req.body.password !== req.body.password_confirm) return res.json({code: 400, error: 'passwords do not match'});
  
  client.send('create', req.body)
    .then(function(result) {
      res.json(result);
    }).catch(function(err) {
      res.json({code:500, error: 'An error occurred'});
    });
});

module.exports = router;
