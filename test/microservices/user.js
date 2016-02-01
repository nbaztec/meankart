/**
 * @author nisheeth
 * @date 02 Oct 2015
 */

var _ = require('lodash');
var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;

chai.use(require('chai-things'));
chai.use(require('sinon-chai'));

// Suppress morgan logging
process.env.NODE_ENV = 'test';

var UserModel = require('../../microservices/user/models/user');

var server = require('../../microservices/user/server');
var handler = require('../../microservices/user/handler');
var when = require('when');

describe('User', function() {

  var user = {
    _id: undefined,
    name: undefined,
    email: undefined,
    password: undefined,
    gender: undefined,
    timezone: undefined,
    verified: undefined,
    phone: undefined,
    address: undefined
  };
  
  describe('ping', function() {
    it('GET should return 200 OK', function (done) {
      handler({
        method: 'ping'
      }, when.defer())
        .then(function(msg) {
          expect(msg).to.deep.equal({code: 200, message: 'OK'});
          done();
        }).catch(function(err) {
          done(err);
        });
    });
  });

  UserModel.prototype.save = sinon.spy(function (cb) {
    if (this.email == 'error@error.com' || this.name == 'ERROR') return cb(new Error('error'), null);
    var self = this;
    _.forEach(user, function(v, k) {
      user[k] = self.get(k);
    });
    cb(null);
  });
  
  UserModel.findOne = sinon.spy(function(f, cb) {
    if (f._id == 1 || f.email == 'error@error.com') return cb(new Error('error'), null);
    
    if (f.email && f.email !== user.email) return cb(null, null);
    if (f._id && f._id !== user._id) return cb(null, null);
    
    cb(null, new UserModel(user));
  });

  UserModel.remove = sinon.spy(function(f, cb) {
      if (f._id == 1) return cb(new Error('error'), null);
      else if (f._id == 2) return cb(null, {
        result: {
          ok: -1,
          n: 1
        }
      });
      else return cb(null, {
          result: {
            ok: 1,
            n: 1
          }
        });
  });
  
  describe('schema', function() {
    it('should get plain password', function (done) {
      var u = new UserModel({
        name: 'Tester',
        email: 'test@test.com',
        password: 'FOO',
        gender: 'male'
      });
      u.set('plain_password', 'TEST');
      u.save(function(err) {
        if (err) return done(err);
        expect(u.get('plain_password')).to.equal('TEST');
        expect(u.get('password')).to.not.equal('TEST');
        done();
      })
    });
    
    it('should hash password and not plain_password', function (done) {
      var origHash = UserModel.hash;
      UserModel.hash = sinon.spy(function(s) {
          return s.split('').reverse().join('');
      });

      var u = new UserModel({
        name: 'Tester',
        email: 'test@test.com',
        password: 'foobar',
        gender: 'male'
      });
      
      when().then(function() {
        var ans = when.defer();
        u.save(function(err) {
          if (err) return ans.reject(err);
          expect(u.get('password')).to.equal('raboof');
          expect(u.get('plain_password')).to.equal('foobar');
          ans.resolve();
        });
        return ans.promise;
      }).then(function() {
        
        // Cover ! isModified(password)
        var origIsModified = UserModel.prototype.isModified;
        UserModel.prototype.isModified = function(k) {
          return false;
        };
        
        u.save(function(err) {
          UserModel.prototype.isModified = origIsModified;
          UserModel.hash = origHash;
          done(err);
        });
      }).catch(function(err) {
        done(err);
      });
    });
  });
  
  describe('create', function() {
    it('should create user', function (done) {
      handler({
        method: 'create',
        args: {
          name: 'Test',
          email: 'test@test.com',
          password: '12345',
          gender: 'male'
        }
      }, when.defer())
        .then(function(msg) {
          expect(UserModel.prototype.save).called;
          expect(msg).to.have.property('code', 200);
          expect(msg).to.have.deep.property('user._id');
          done();
        })
        .catch(function(err) {
          done(err);
        })
    });

    it('should not create user', function (done) {
      handler({
        method: 'create',
        args: {
          name: 'Test',
          email: 'error@error.com',
          password: '12345',
          gender: 'male'
        }
      }, when.defer())
        .then(function(msg) {
          expect(UserModel.prototype.save).called;
          expect(msg).to.have.property('code', 400);
          done();
        })
        .catch(function(err) {
          done(err);
        })
    });
  });
  
  describe('authenticate', function() {
    it('should authenticate user', function (done) {
      handler({
        method: 'authenticate',
        args: {
          email: 'test@test.com',
          password: '12345'
        }
      }, when.defer())
        .then(function(msg) {
          expect(msg).to.deep.equal({code: 200, message: 'OK'});
          done();
        })
        .catch(function(err) {
          done(err);
        })
    });
    it('should not find user', function (done) {
      handler({
        method: 'authenticate',
        args: {
          email: 'invalid@test.com',
          password: '12345'
        }
      }, when.defer())
        .then(function(msg) {
          //console.log(msg)
          expect(msg).have.property('code', 404);
          done();
        })
        .catch(function(err) {
          done(err);
        })
    });
    it('should not authenticate user', function (done) {
      handler({
        method: 'authenticate',
        args: {
          email: 'test@test.com',
          password: 'INVALID'
        }
      }, when.defer())
        .then(function(msg) {
          expect(msg).have.property('code', 404);
          done();
        })
        .catch(function(err) {
          done(err);
        })
    });

    it('should return error', function (done) {
      handler({
        method: 'authenticate',
        args: {
          email: 'error@error.com',
          password: 'INVALID'
        }
      }, when.defer())
        .then(function(msg) {
          expect(msg).have.property('code', 400);
          done();
        })
        .catch(function(err) {
          done(err);
        })
    });
  });
  
  describe('update', function() {
   
    it('should update user', function (done) {
      handler({
        method: 'update',
        args: {
          id: user._id,
          data: {
            name: 'Nisz',
            email: 'nbaztec@gmail.com',
            gender: 'male'
          }
        }
      }, when.defer())
        .then(function(msg) {
          expect(UserModel.prototype.save).called;
          expect(msg).to.have.property('code', 200);
          expect(msg).to.have.deep.property('user.name', 'Nisz');
          expect(msg).to.have.deep.property('user.email', 'test@test.com');
          
          done();
        })
        .catch(function(err) {
          done(err);
        })
    });

    it('should not update user - 400 error on find', function (done) {
      handler({
        method: 'update',
        args: {
          id: 1,
          data: {
            name: 'Nisz',
            email: 'nbaztec@gmail.com',
            gender: 'male'
          }
        }
      }, when.defer())
        .then(function(msg) {
          expect(UserModel.prototype.save).called;
          expect(msg).to.deep.equal({code: 400, error: 'error'});

          done();
        })
        .catch(function(err) {
          done(err);
        })
    });

    it('should not find user - 404 error', function (done) {
      handler({
        method: 'update',
        args: {
          id: 2,
          data: {
            name: 'Nisz',
            email: 'nbaztec@gmail.com',
            gender: 'male'
          }
        }
      }, when.defer())
        .then(function(msg) {
          expect(UserModel.prototype.save).called;
          expect(msg).to.deep.equal({code: 404, error: 'Not found'});

          done();
        })
        .catch(function(err) {
          done(err);
        })
    });

    it('should not save user details', function (done) {
      handler({
        method: 'update',
        args: {
          id: user._id,
          data: {
            name: 'ERROR',
            email: 'nbaztec@gmail.com',
            gender: 'male'
          }
        }
      }, when.defer())
        .then(function(msg) {
          expect(UserModel.prototype.save).called;
          expect(msg).to.deep.equal({code: 400, error: 'error'});

          done();
        })
        .catch(function(err) {
          done(err);
        })
    });
    
    it('should update password', function (done) {
      var answer = when.defer();

      handler({
        method: 'update',
        args: {
          id: user._id,
          data: {
            password: 'FUBAR',
            gender: 'male'
          }
        }
      }, when.defer())
        .then(function(msg) {
          //console.log(msg);
          expect(UserModel.prototype.save).called;
          expect(msg).to.have.property('code', 200);
          
          return handler({
            method: 'authenticate',
            args: {
              email: 'test@test.com',
              password: 'FUBAR'
            }
          }, when.defer());
        })
        .then(function(msg) {
          //console.log(msg);
          expect(msg).to.have.property('code', 200);
  
          return handler({
            method: 'authenticate',
            args: {
              email: 'test@test.com',
              password: 'INVALID'
            }
          }, when.defer());
        })
        .then(function(msg) {
            expect(msg).to.have.property('code', 404);
            done();
        })
        .catch(function(err) {
        done(err);
      });
    });
  });
  
  describe('remove', function() {
    it('should give error', function (done) {
      handler({
        method: 'remove',
        args: {
          id: 1
        }
      }, when.defer())
        .then(function(msg) {
          expect(UserModel.remove).called;
          expect(msg).to.deep.equal({code: 400, error: 'error'});
          done();
        })
        .catch(function(err) {
          done(err);
        })
    });

    it('should give unknown error', function (done) {
      handler({
        method: 'remove',
        args: {
          id: 2
        }
      }, when.defer())
        .then(function(msg) {
          expect(UserModel.remove).called;
          expect(msg).to.deep.equal({code: 400, error: 'Unknown error occurred'});
          done();
        })
        .catch(function(err) {
          done(err);
        })
    });
    
    it('should remove user', function (done) {
      handler({
        method: 'remove',
        args: {
          id: user._id
        }
      }, when.defer())
        .then(function(msg) {
          expect(UserModel.remove).called;
          expect(msg).to.deep.equal({code: 200, message: 'OK'});
          done();
        })
        .catch(function(err) {
          done(err);
        })
    });
  });
  
  describe('invalid methods', function() {
    it('should return 404', function (done) {
      handler({
        method: 'invalid',
        args: {
          foo: 'bar'
        }
      }, when.defer())
        .then(function(msg) {
          expect(msg).to.deep.equal({code: 404, error: 'Invalid method'});
          done();
        })
        .catch(function(err) {
          done(err);
        })
    });
  });
  
});