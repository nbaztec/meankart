/**
 * @author nisheeth
 * @date 29 Sep 2015
 */

var redis = require('../config/redis');
module.exports = function(req, res, next) {
  if (req.headers['authorization']) {
    var token = req.headers['authorization'].split()[1];
    var client = redis();
    try {
      req.user = JSON.parse(client.get('auth:' + token));
    } catch (e) {}
  }
  
  next();
};