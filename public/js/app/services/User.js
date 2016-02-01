/**
 * @author nisheeth
 * @date 30 Sep 2015
 */

angular.module('meankart')
  .factory('UserService', ['$http', 'AuthService', function($http, AuthService) {
      return {
        session: function() {
          if (AuthService.getUser()) return null;
          $http.post('/api/user/session', null)
            .then(function(r) {
              if (r.data) {
                r.data.user.token = r.data.token;
                AuthService.setUser(r.data.user);
              }
            });
        },
        
        destroy: function(success, error) {
          $http.post('/api/user/session', {destroy: true})
            .then(function(r) {
              if (r.data.code === 200) {
                AuthService.setUser(null);
              }
              success(r);
            }, error);
        },
        
        authenticate: function(user, success, error) {
          $http.post('/api/user/authenticate', user)
            .then(function(r) {
              if (r.data.code === 200) {
                r.data.user.token = r.data.token;
                AuthService.setUser(r.data.user);
              }
              success(r);
            }, error);
        },
        
        create: function(user, success, error) {
          $http.post('/api/user/create', user)
            .then(success, error);
        }
      };
  }]);