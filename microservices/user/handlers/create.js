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
  if ( ! validator.isLength(req.args.name, { min:1 })) return res.resolve({code: 400, error: 'parameter name is required'});
  if ( ! validator.isLength(req.args.username, { min:1 })) return res.resolve({code: 400, error: 'parameter username is required'});
  if ( ! validator.isLength(req.args.password, { min:1 })) return res.resolve({code: 400, error: 'parameter password is required'});
  if ( ! validator.isLength(req.args.gender, { min:1 })) return res.resolve({code: 400, error: 'parameter gender is required'});
  
  var user = new UserModel({
    name: req.args.name,
    email: req.args.email,
    username: req.args.username,
    password: req.args.password,
    gender: req.args.gender
  });
  
  user.save(function(err) {
    if (err) return res.resolve({code: 400, error: err.message});
    
    res.resolve({code: 200, user: _.omit(user.toJSON(), ['__v', 'password'])});
  });
};