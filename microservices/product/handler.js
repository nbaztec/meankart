#!/usr/bin/env node

/**
 * @author nisheeth
 * @date 09 Oct 2015
 */

var fs = require('fs');

module.exports = function(req, res) {
  
  switch (req.method) {
    case 'ping':
      res.resolve({ code: 200, message: 'OK' });
      break;

    default:
      fs.stat(__dirname + '/handlers/' + req.method + '.js', function(err, stats) {
        if (err || ! stats.isFile()) return res.resolve({code: 404, error: 'Invalid method'});
        require(__dirname + '/handlers/' + req.method)(req, res);
      });
      
      break;
  }
  return res.promise;
};