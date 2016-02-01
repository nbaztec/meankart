#!/usr/bin/env node

/**
 * @author nisheeth
 * @date 09 Oct 2015
 */

var amqp = require('amqplib');
var when = require('when');

function toBuffer(msg) {
  return  new Buffer(JSON.stringify(msg));
}

function fromBuffer(msg) {
  return JSON.parse(msg.content.toString());
}

function init(config) {
  amqp.connect(config.host).then(function(conn) {

    return conn.createChannel().then(function(ch) {

      var q = config.queue.name;
      return ch.assertQueue(q, config.queue.options)
          .then(function() {
            ch.prefetch(1);
            return ch.consume(q, function reply(msg) {
              //console.log('[x] Got message');
              msg.content = fromBuffer(msg);

              console.log('-> ' + JSON.stringify(msg.content));

              function send(result) {
                console.log('<- ' + JSON.stringify(result));
                ch.sendToQueue(msg.properties.replyTo,
                    toBuffer(result),
                    {correlationId: msg.properties.correlationId});
                ch.ack(msg);
              }

              config.handler(msg.content, when.defer())
                  .then(function(result) {
                    //console.log(result);
                    send(result);
                  })
                  .catch(function(err) {
                    //console.log(err);
                    send({code: 500, error: err.message});
                  });
            }, {noAck:false});
          })
          .then(function() {
            //console.log(' [x] Awaiting RPC requests');
          });
    });
  }).then(null, console.warn);
}

module.exports = function(config) {
  return function() {
    init(config)
  }
};