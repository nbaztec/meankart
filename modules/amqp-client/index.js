#!/usr/bin/env node

/**
 * @author nisheeth
 * @date 09 Oct 2015
 */

var amqp = require('amqplib');
var when = require('when');
var _ = require('lodash');
var uuid = require('node-uuid');

function toBuffer(msg) {
  return  new Buffer(JSON.stringify(msg));
}

function fromBuffer(msg) {
  return JSON.parse(msg.content.toString());
}

var channel = null;
var client_queue = null;
var answers = {};
var pendingRequests = [];

function processPendingRequests() {
  _.remove(pendingRequests, function(next) {
    next();
    return true;
  });
}

function init(config) {
  amqp.connect(config.host).then(function(conn) {
    return conn.createChannel().then(function(ch) {
      channel = ch;
      //var answer = when.defer();
      return ch.assertQueue('', {exclusive: true})
        .then(function(qok) {
          client_queue = qok.queue;
          return qok.queue;
        })
        .then(function(queue) {
          return ch.consume(queue, function (msg) {

            var data = fromBuffer(msg);
            /*
            if (msg.properties.correlationId in answers) {
              answers[msg.properties.correlationId].resolve(data);
              delete answers[msg.properties.correlationId];
            }
            */
            answers[msg.properties.correlationId].resolve(data);
            delete answers[msg.properties.correlationId];
            //if (_.values(answers).length === 0) answer.resolve(true);
          }, {noAck: true})
            .then(function() { return queue; });
        })
        .then(function(queue) {
          processPendingRequests();
          //return answer.promise;
        });
    });
  }).catch(console.warn);
}

function client(queue) {
  return  {
    send: function(method, args, meta) {

      var corrId = uuid();
      var answer = when.defer();

      answers[corrId] = answer;

      if ( ! client_queue) {
        pendingRequests.push(function() {
          channel.sendToQueue(queue, toBuffer({
            method: method,
            args: args || {},
            meta: meta || {}
          }), {
            correlationId: corrId, replyTo: client_queue
          });
        })
      } else {
        //console.log('send');
        channel.sendToQueue(queue, toBuffer({
          method: method,
          args: args || {},
          meta: meta || {}
        }), {
          correlationId: corrId, replyTo: client_queue
        });
        //console.log('sent');
      }

      return answer.promise;
    }
  }
}
module.exports = function(config) {
  init(config);
  return {
    client: function(queue) {
      return client(queue)
    }
  }
};