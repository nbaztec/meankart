/**
 * @author nisheeth
 * @date 01 Oct 2015
 */

var mongoose = require('mongoose');
var crypto = require('crypto');

var AuthorizationCodeSchema = new mongoose.Schema({
  clientId: {type: String, required: true},
  value: {type: String, required: true},
  redirectUri: {type: String, required: true},
  expiresAt: {type: Date, required: true}
}, {
  collection: 'authorization_codes'
});

AuthorizationCodeSchema.index({expiresAt: 1}, {expireAfterSeconds: 5*60});

AuthorizationCodeSchema.statics = {
  generate: function() {
    return crypto.randomBytes(20).toString('hex');
  }
};

module.exports = mongoose.model('AuthorizationCode', AuthorizationCodeSchema);