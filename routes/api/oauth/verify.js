var express = require('express');
var router = express.Router();

var moment = require('moment');
var mongoose = require('mongoose');
var async = require('async');

var ClientModel = require('../../models/client');
var UserModel = require('../../models/user');
var AccessTokenModel = require('../../models/accessToken');

router.post('/', function(req, res, next) {
  req.checkBody('accessToken', 'Required parameter accessToken').notEmpty();
  req.checkBody('clientId').notEmpty().withMessage('Required parameter clientId').isObjectId().withMessage('Invalid client ID');
  req.checkBody('clientSecret', 'Required parameter clientSecret').notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    return res.status(400).json({error: errors});
  }

  async.waterfall([
    function(cb) {
      ClientModel.findOne({
        _id: req.body.clientId,
        secret: req.body.clientSecret
      }, function(err, doc) {

        if (err) return cb(err);

        if ( ! doc) return cb({code: 404, message: 'Verification failed for client'});

        cb(null, doc);
      });
    },
      
    function(client, cb) {
      AccessTokenModel.findOne({
        clientId: client.id,
        value: req.body.accessToken
      }, function(err, doc) {

        if (err) return cb({code: 400, message: err.message});

        if ( ! doc) return cb({code: 404, message: 'Invalid access token'});

        if (doc.expiresAt < moment()) return cb({code: 404, message: 'Access token has expired'});

        cb(null, client.userId);
      });
    },

    function(userId, cb) {
      UserModel.findOne({
        _id: userId
      })
        .select({
            name: 1,
            username: 1
        })
       .exec(function(err, doc) {

        if (err) return cb(err);

        if ( ! doc) return cb({code: 404, message: 'User not found'});

        cb(null, doc);
      });
    }
  ], function(err, user) {

    if (err) return res.status(err.code || 400).json({error: err.message});
    
    res.status(200).json(user);
  });
});

module.exports = router;
