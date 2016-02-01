#!/usr/bin/env node

/**
 * @author nisheeth
 * @date 09 Oct 2015
 */

var ProductModel = require('../models/product');
var _ = require('lodash');
var validator = require('validator');

module.exports = function (req, res) {

  if ( ! validator.isLength(req.args.name, { min:1 })) return res.resolve({code: 400, error: 'parameter name is required'});
  if ( ! validator.isLength(req.args.brand, { min:1 })) return res.resolve({code: 400, error: 'parameter brand is required'});
  if ( ! validator.isLength(req.args.description, { min:1 })) return res.resolve({code: 400, error: 'parameter description is required'});
  if ( ! validator.isLength(req.args.price, { min:1 })) return res.resolve({code: 400, error: 'parameter price is required'});
  
  var product = new ProductModel({
    name: req.args.name,
    brand: req.args.brand,
    description: req.args.description,
    price: req.args.price
  });

  product.save(function(err) {
    if (err) return res.resolve({code: 400, error: err.message});
    
    res.resolve({code: 200, product: product.toJSON()});
  });
};