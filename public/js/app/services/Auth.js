/**
 * @author nisheeth
 * @date 30 Sep 2015
 */

angular.module('meankart')
  .factory('AuthService', ['$sessionStorage', function($sessionStorage) {
      var $storage = $sessionStorage.$default({
        token: null
      });
    
      return {
        setUser: function(user) {
          $storage.user = user;
        },

        unsetUser: function() {
          delete $storage.user;
        },
        
        getUser: function() {
          return $storage.user;
        }
      };
  }]);