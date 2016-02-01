/**
 * @author nisheeth
 * @date 09 Oct 2015
 */


var when = require('when');
var _ = require('lodash');


module.exports = function(msg) {
  var answer = when.defer();
  switch (msg.method) {
    case 'authenticate':
      if (msg.args.username === 'nbaztec' && msg.args.password === '12345') answer.resolve({ userId: 123, time: msg.meta.time });
      answer.resolve({ code: 404, error: 'Invalid user' });
      break;

    case 'sum':
      var s = 0;
      if (msg.meta.extra) {
        _.merge(msg.args, msg.meta.extra);
      }

      msg.args.forEach(function(v) {
        s += v;
      });
      answer.resolve({ result: s });
      break;
  }
  
  return answer.promise;
};