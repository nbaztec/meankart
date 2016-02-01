var express = require('express');
var router = express.Router();

var moment = require('moment');
var mongoose = require('mongoose');
var async = require('async');

var ClientModel = require('../../models/client');
var AuthorizationCodeModel = require('../../models/authorizationCode');
var AccessTokenModel = require('../../models/accessToken');
var RefreshTokenModel = require('../../models/refreshToken');

router.post('/', function(req, res, next) {
  req.checkBody('authCode', 'Required parameter authCode').notEmpty();
  req.checkBody('clientId').notEmpty().withMessage('Required parameter clientId').isObjectId().withMessage('Invalid client ID');
  req.checkBody('clientSecret', 'Required parameter clientSecret').notEmpty();
  req.checkBody('redirectUri', 'Required parameter redirectUri').notEmpty();
  
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
      AuthorizationCodeModel.findOne({
        clientId: client.id,
        value: req.body.authCode
      }, function(err, doc) {

        if (err) return cb({code: 400, message: err.message});

        if ( ! doc) return cb({code: 404, message: 'Invalid authorization code'});

        if (doc.expiresAt < moment()) return cb({code: 404, message: 'Authorization code has expired'});

        if (doc.redirectUri !== req.body.redirectUri) return cb({code: 404, message: 'Redirect URI does not match'});

        cb(null, client.id, client.userId);
      });
    },
   
    function(clientId, userId, cb) {
      var tokenObj = {
        clientId: clientId,
        userId: userId,
        value: AccessTokenModel.generate(),
        expiresAt: moment().add(1, 'hour')
      };
      
      AccessTokenModel.update({
        userId: userId
      }, tokenObj, {
        upsert: true
      }, function(err) {

        if (err) return cb(err);

        cb(null, userId, tokenObj);
      });
    },
    
    function(userId, accessToken, cb) {
      var tokenObj = {
        userId: userId,
        clientId: req.body.clientId,
        value: RefreshTokenModel.generate()
      };
      
      RefreshTokenModel.update({
        userId: userId
      }, tokenObj, {
        upsert: true
      }, function(err) {
        if (err) return cb(err);

        var tokens = {
          access_token: accessToken.value,
          access_token_expire: accessToken.expiresAt,
          refresh_token: tokenObj.value
        };

        /*
        request.post({
          url:req.body.redirectUri,
          form: {
            message: 'OK',
            result: JSON.stringify(tokens)
          }
        }, function(err, httpResponse, body) {
          
          if (err) return res.send(400).json({error: err});
          
          res.status(httpResponse.statusCode).json(JSON.parse(body));
        });
        */
        res.status(200).json({
          message: 'OK',
          result: tokens
        });
      });
    }
  ], function(err) {
    
    if (err) return res.status(err.code || 400).json({error: err.message});
    
  });
});

module.exports = router;
