/**
 * @author nisheeth
 * @date 01 Oct 2015
 */

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  name: {type: String, required: true}
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
  this.password = hash(this.password);
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