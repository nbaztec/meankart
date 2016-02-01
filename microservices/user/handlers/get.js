#!/usr/bin/env node

/**
 * @author nisheeth
 * @date 09 Oct 2015
 */

var UserModel = require('../models/user');
var _ = require('lodash');

module.exports = function (req, res) {
  UserModel.findOne({
    _id: req.args.id
  }, function(err, doc) {
    
    if (err) return res.resolve({code: 400, error: err.message});
    if ( ! doc) return res.resolve({code: 404, error: 'Not found'});
    
    return res.resolve({code: 200, user: doc.toJSON()});
  });
};