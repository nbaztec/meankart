/**
 * @author nisheeth
 * @date 30 Sep 2015
 */

var _ = require('lodash');

module.exports = function() {
  return function(req, res, next) {
    _.assign(res.locals, {
      app: 'meankart',
      appName: 'MeanKart'
    });
    next();
  };
};