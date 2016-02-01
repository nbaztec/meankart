/**
 * @author nisheeth
 * @date 02 Oct 2015
 */

var when = require('when');
var _ = require('lodash');
var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;

chai.use(require('chai-things'));
chai.use(require('sinon-chai'));

// Suppress morgan logging
process.env.NODE_ENV = 'test';

var server = require('../modules/amqp-server');
var amqpClient = require('../modules/amqp-client')({
  host: 'amqp://localhost'
});

var serverFunc = server({
  host: 'amqp://localhost',
  queue: {
    name: 'amqp.test',
    options: {
      durable: false
    }
  },
  handler: function(req, res) {
    if (req.method === 'reject') res.reject(new Error('Not Implemented'));
    else res.resolve(req);
    return res.promise;
  }
});


var client = amqpClient.client('amqp.test');


describe('AMQP', function() {

  describe('server', function() {
    setTimeout(serverFunc, 500);
    it('should return delayed ping', function (done) {
      client.send('ping', {
        foo: 'bar'
      }, {
        baz: 1
      }).then(function(msg) {
        expect(msg).to.deep.equal({ method: 'ping', args: { foo: 'bar' }, meta: { baz: 1 } });
        done();
      }).catch(function(err) {
        done(err);
      });
    });
    
    it('should return ping', function (done) {
      client.send('ping', {
        foo: 'bar'
      }, {
        baz: 1
      }).then(function(msg) {
        expect(msg).to.deep.equal({ method: 'ping', args: { foo: 'bar' }, meta: { baz: 1 } });
        done();
      }).catch(function(err) {
        done(err);
      });
    });

    it('should return 500 error', function (done) {
      client.send('reject', {
        foo: 'bar'
      }).then(function(msg) {
        expect(msg).to.deep.equal({ code: 500, error: 'Not Implemented' });
        done();
      }).catch(function(err) {
        done(err);
      });
    });
  });
});