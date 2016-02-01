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
      AccessTokenModel.remove({
        clientId: client.id,
        value: req.body.accessToken
      }, function(err, resp) {

        if (err) return cb({code: 400, message: err.message});

        cb(null, client);
      });
    },

    function(client, cb) {
      RefreshTokenModel.remove({
        clientId: client.id
      }, function(err, resp) {

        if (err) return cb({code: 400, message: err.message});

        cb(null);
      });
    }
  ], function(err) {
    
    if (err) return res.status(err.code || 400).json({error: err.message});
    
    res.status(200).json({
      message: 'OK'
    });
  });
});

module.exports = router;
