/**
 * @author nisheeth
 * @date 01 Oct 2015
 */

var mongoose = require('mongoose');
var crypto = require('crypto');

var RefreshTokenSchema = new mongoose.Schema({
  clientId: {type: String, required: true},
  userId: {type: mongoose.Schema.Types.ObjectId, required: true, unique: true},
  value: {type: String, required: true}
}, {
  collection: 'refresh_tokens'
});

RefreshTokenSchema.statics = {
  generate: function() {
    return crypto.randomBytes(40).toString('hex');
  }
};

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);