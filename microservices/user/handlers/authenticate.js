#!/usr/bin/env node

/**
 * @author nisheeth
 * @date 09 Oct 2015
 */

var UserModel = require('../models/user');
var _ = require('lodash');
var validator = require('validator');

module.exports = function (req, res) {
  
  if ( ! validator.isLength(req.args.email, { min:1 })) return res.resolve({code: 400, error: 'parameter email is required'});
  if ( ! validator.isLength(req.args.password, { min:1 })) return res.resolve({code: 400, error: 'parameter password is required'});
  
  UserModel.findOne({
    email: req.args.email
  }, function(err, doc) {
    if (err) return res.resolve({code: 400, error: err.message});
    
    if ( ! doc) return res.resolve({code: 404, error: 'Not found'});
    
    if ( ! doc.authenticate(req.args.password)) return res.resolve({code: 404, error: 'Authentication error'});
    
    return res.resolve({code: 200, message: 'OK', user: _.omit(doc.toJSON(), ['password'])});
  });
};