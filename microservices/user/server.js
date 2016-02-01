#!/usr/bin/env node

/**
 * @author nisheeth
 * @date 09 Oct 2015
 */

var mongoose = require('mongoose');
require('./config/mongodb')(mongoose);

var server = require('../../modules/amqp-server');
module.exports = server({
  host: 'amqp://localhost',
  queue: {
    name: 'meankart.user',
    options: {
      durable: true
    }
  },
  handler: require('./handler')
});

