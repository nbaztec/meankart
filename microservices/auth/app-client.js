#!/usr/bin/env node

/**
 * @author nisheeth
 * @date 09 Oct 2015
 */
var client = require('./client');

client.send('authenticate', {
  username: 'nbaztec',
  password: '12345'
}, {
  time: 'now'
}).then(function(msg) {
  console.log('ID = ' + msg.userId);
  console.log('Time = ' + msg.time);
}).catch(function(err) {
  console.warn(err);
});

client.send('sum', [5, 6], {
  extra: [7, 9]
}).then(function(msg) {
  console.log('Sum = ' + msg.result);
}).catch(function(err) {
  console.warn(err);
});