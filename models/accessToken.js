/**
 * @author nisheeth
 * @date 01 Oct 2015
 */

var mongoose = require('mongoose');
var crypto = require('crypto');

var AccessTokenSchema = new mongoose.Schema({
  clientId: {type: String, required: true},
  userId: {type: mongoose.Schema.Types.ObjectId, required: true, unique: true},
  value: {type: String, required: true},
  expiresAt: {type: Date, required: true}
}, {
  collection: 'access_tokens'
});

AccessTokenSchema.index({expiresAt: 1}, {expireAfterSeconds: 5*60});

AccessTokenSchema.statics = {
  generate: function() {
    return crypto.randomBytes(40).toString('hex');
  }
};

module.exports = mongoose.model('AccessToken', AccessTokenSchema);