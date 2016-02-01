/**
 * @author nisheeth
 * @date 01 Oct 2015
 */

var mongoose = require('mongoose');
var crypto = require('crypto');

var ClientSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, required: true, unique: true},
  secret: {type: String, required: true}
});

ClientSchema.statics = {
  generate: function() {
    return crypto.randomBytes(40).toString('hex');
  }
};

module.exports = mongoose.model('Client', ClientSchema);