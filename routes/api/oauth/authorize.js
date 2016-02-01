var express = require('express');
var router = express.Router();

var queryString = require('querystring');
var moment = require('moment');
var mongoose = require('mongoose');

var ClientModel = require('../../models/client');
var AuthorizationCodeModel = require('../../models/authorizationCode');

router.post('/', function(req, res, next) {

  req.checkBody('clientId').notEmpty().withMessage('Required parameter clientId').isObjectId().withMessage('Invalid client ID');
  req.checkBody('clientSecret', 'Required parameter clientSecret').notEmpty();
  req.checkBody('redirectUri', 'Required parameter redirectUri').notEmpty();
  
  var errors = req.validationErrors();
  
  if (errors) {
    return res.status(400).json({error: errors});
  }
  
  ClientModel.findOne({
    _id: req.body.clientId,
    secret: req.body.clientSecret
  }, function(err, doc) {

    if (err) return res.status(400).json({error: err.message});
    
    if ( ! doc) {
      return res.status(404).json({error: 'Invalid client'});
    }

    var codeObj = new AuthorizationCodeModel ({
      clientId: req.body.clientId,
      value: AuthorizationCodeModel.generate(),
      redirectUri: req.body.redirectUri,
      expiresAt: moment().add(15, 'minutes')
    });
    
    codeObj.save(function(err) {

      if (err) return res.status(400).json({error: err.message});
      
      res.redirect(req.body.redirectUri + '?' + queryString.stringify({
        auth_code: codeObj.value, 
        client_id: req.body.clientId
      }));
    });
  });
});

/*
// Test callback methods
router.get('/authorize/cb', function(req, res, next) {

  var thisUrl = req.protocol + '://' + req.get('host') + req.route.path;

  request.post({
    url:'http://localhost:9000/token',
    form: {
      clientId: req.query.client_id,
      authCode: req.query.auth_code,
      redirectUri: thisUrl
    }
  }, function(err, httpResponse, body) {

    if (err) return res.send(400).json({error: err});

    return res.status(httpResponse.statusCode).json(JSON.parse(body));
  });
});

router.post('/authorize/cb', function(req, res, next) {
  var body = req.body;
  body.result = JSON.parse(body.result);
  res.status(200).json(body);
});
*/

module.exports = router;
