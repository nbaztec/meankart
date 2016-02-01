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

    // clean data
    _.forEach(_.pick(req.args.data, ['password', 'name', 'gender', 'address', 'phone', 'timezone', 'verified']), function(v, k) {
      doc.set(k, v);
    });

    // save data
    doc.save(function(err) {
      if (err) return res.resolve({code: 400, error: err.message});
      res.resolve({code: 200, user: _.omit(doc.toJSON(), ['__v', 'password'])});
    });
  });
};