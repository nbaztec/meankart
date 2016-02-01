/**
 * @author nisheeth
 * @date 29 Sep 2015
 */

var redis = require('redis');

module.exports = function () {
  return redis.createClient(6379, '127.0.0.1');
};