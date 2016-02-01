#!/usr/bin/env node

/**
 * @author nisheeth
 * @date 09 Oct 2015
 */
var amqpClient = require('../../modules/amqp-client')({
  host: 'amqp://localhost'
});

var client = amqpClient.client('meankart.user');

/*
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
  console.log(msg);
}).catch(function(err) {
  console.warn(err);
});
*/
/*
client.send('create', {
  name: 'Nisz',
  email: 'nbaztec@gmail.com',
  password: '12345',
  gender: 'male'
}).then(function(msg) {
  console.log(msg);
}).catch(function(err) {
  console.warn(err);
});
*/
/*
client.send('authenticate', {
  email: 'nbaztec@gmail.com',
  password: '112345'
}).then(function(msg) {
  console.log(msg)
}).catch(function(err) {
  console.warn(err);
});

client.send('update', {
  id: '562a06d7a7d84ce33e0f7fd8',
  data: {
    name: 'Nisz',
    email: 'nbaztec@gmail.com',
    password: '12345',
    gender: 'male',
    timezone: +19800,
    address: 'D-79, Moti Bagh I'
  }
}).then(function(msg) {
  console.log(msg);
}).catch(function(err) {
  console.warn(err);
});

client.send('authenticate', {
  email: 'nbaztec@gmail.com',
  password: '12345'
}).then(function(msg) {
  console.log(msg)
}).catch(function(err) {
  console.warn(err);
});
*/
client.send('remove', {
  id: '562a06d7a7d84ce33e0f7fd8'
}).then(function(msg) {
  console.log(msg);
}).catch(function(err) {
  console.warn(err);
});