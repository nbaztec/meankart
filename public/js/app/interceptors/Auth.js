/**
 * @author nisheeth
 * @date 30 Sep 2015
 */

angular.module('meankart')
  .factory('AuthInterceptor', ['$location', 'AuthService', function($location, AuthService) {
      return {
        request: function(config) {
          config.headers = config.headers || {};
          var user = AuthService.getUser();
          if (user) {
            config.headers.Authorization = 'Bearer ' + user.token;
          }
          return config;
        },
        
        responseError: function(response) {
          if(response.data.code === 401) {
            $location.path('/login');
          }
          return response;
        }
      };
  }]);