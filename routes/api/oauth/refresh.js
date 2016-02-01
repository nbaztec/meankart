var express = require('express');
var router = express.Router();

var moment = require('moment');
var mongoose = require('mongoose');
var async = require('async');

var ClientModel = require('../../models/client');
var AccessTokenModel = require('../../models/accessToken');
var RefreshTokenModel = require('../../models/refreshToken');

router.post('/', function(req, res, next) {
  req.checkBody('accessToken', 'Required parameter accessToken').notEmpty();
  req.checkBody('refreshToken', 'Required parameter refreshToken').notEmpty();
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

        cb(null, client, doc);
      });
    },

    function(client, accessToken, cb) {
      RefreshTokenModel.findOne({
        clientId: client.id,
        value: req.body.refreshToken
      }, function(err, doc) {

        if (err) return cb({code: 400, message: err.message});

        if ( ! doc) return cb({code: 404, message: 'Invalid refresh token'});

        accessToken.expiresAt = moment().add(1, 'hour');
        accessToken.save(function(err) {
          cb(err, accessToken);
        });
      });
    }
      
  ], function(err, accessToken) {

    if (err) return res.status(err.code || 400).json({error: err.message});
    
    res.status(200).json({
      access_token: accessToken.value,
      access_token_expire: accessToken.expiresAt
    });
  });
});

module.exports = router;
