var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

var UserModel = require('../../models/user');
var ClientModel = require('../../models/client');


// Setup code
router.get('/', function(req, res, next) {
  var user = new UserModel({
    username: 'nbaztec',
    password: '123456',
    name: 'Nisz'
  });

  user.save(function(err) {
    
    if (err) return res.status(400).json({error: err.message});

    var client = new ClientModel({
      userId: user.id,
      secret: 'foobar'
    });
    
    client.save(function(err) {
      
      if (err) return res.status(400).json({error: err.message});
      
      res.status(200).json({'message': 'OK', user: user.toJSON(), client: client.toJSON()});
    });
  });
});

module.exports = router;
