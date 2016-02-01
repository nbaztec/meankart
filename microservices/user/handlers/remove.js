#!/usr/bin/env node

/**
 * @author nisheeth
 * @date 09 Oct 2015
 */

var UserModel = require('../models/user');
var _ = require('lodash');

module.exports = function (req, res) {
  UserModel.remove({
    _id: req.args.id
  }, function(err, r) {
    
    if (err) return res.resolve({code: 400, error: err.message});
    if (r.result.ok != 1) res.resolve({code: 400, error: 'Unknown error occurred'});
    
    return res.resolve({code: 200, message: 'OK'});
  });
};