/**
 * @author nisheeth
 * @date 23 Oct 2015
 */

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true, lowercase: true, unique: true},
  password: {type: String, required: true},
  gender: {type: String, required: true},
  verified: {type: Boolean, default: false},
  phone: {type: String},
  address: {type: String},
  timezone: {type: Number, default: 0}
});

UserSchema
  .virtual('plain_password')
  .set(function(password) {
    this.password = this._password = password;
  })
  .get(function() { return this._password });

UserSchema.pre('save', function(next) {
  if ( ! this.isModified('password')) return next();

  this.plain_password = this.password;
  this.password = this.constructor.hash(this.password);
  next();
});

UserSchema.methods = {
  authenticate: function(password) {
    return bcrypt.compareSync(password, this.password);
  }
};

UserSchema.statics = {
  hash: hash
};

function hash(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

module.exports = mongoose.model('User', UserSchema);