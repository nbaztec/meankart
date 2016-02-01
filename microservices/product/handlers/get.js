#!/usr/bin/env node

/**
 * @author nisheeth
 * @date 09 Oct 2015
 */

var ProductModel = require('../models/product');

module.exports = function (req, res) {
  ProductModel.findOne({
    _id: req.args.id
  }, function(err, doc) {

    if (err) return res.resolve({code: 400, error: err.message});
    if ( ! doc) return res.resolve({code: 404, error: 'Not found'});

    return res.resolve({code: 200, user: doc.toJSON()});
  });
};