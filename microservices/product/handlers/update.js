#!/usr/bin/env node

/**
 * @author nisheeth
 * @date 09 Oct 2015
 */

var ProductModel = require('../models/product');
var _ = require('lodash');

module.exports = function (req, res) {
  ProductModel.findOne({
    _id: req.args.id
  }, function(err, doc) {
    if (err) return res.resolve({code: 400, error: err.message});
    if ( ! doc) return res.resolve({code: 404, error: 'Not found'});

    // clean data
    _.forEach(_.pick(req.args.data, ['name', 'brand', 'description', 'price']), function(v, k) {
      doc.set(k, v);
    });

    // save data
    doc.save(function(err) {
      if (err) return res.resolve({code: 400, error: err.message});
      res.resolve({code: 200, product: doc.toJSON()});
    });
  });
};