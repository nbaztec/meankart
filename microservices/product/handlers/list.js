#!/usr/bin/env node

/**
 * @author nisheeth
 * @date 09 Oct 2015
 */

var ProductModel = require('../models/product');
var _ = require('lodash');
var validator = require('validator');

module.exports = function (req, res) {

  var limit = 10;
  var skip = (req.args.page || 0 ) * limit;
  
  ProductModel.find()
    .skip(skip)
    .limit(limit)
    .exec(function(err, docs) {
      
      if (err) return res.resolve({code: 400, error: err.message});
      
      if ( ! docs) return res.resolve({code: 404, error: 'Not found'});
      
      _.each(docs, function(doc) {
        doc.description = doc.description.substr(0, 50) 
          + (doc.description.length > 50? '...': '');
      });
      return res.resolve({code: 200, message: 'OK', products: docs, page: (req.args.page || 0) + 1});
  });
};