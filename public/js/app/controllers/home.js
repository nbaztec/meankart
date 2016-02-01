/**
 * @author nisheeth
 * @date 30 Sep 2015
 */

angular.module('meankart')
  .controller('HomeController', ['$location', '$window', 'ngToast', 'AuthService', 'UserService', 
    function($location, $window, ngToast, AuthService, UserService) {
      this.go = function(p) {
        $location.path(p);
      };
      
      this.goWindow = function(p) {
        $window.location.href = p;
      };
      
      this.authenticated = function() {
        return !! AuthService.getUser();
      };
      
      this.user = function() {
        return AuthService.getUser();
      };
      
      this.cart = function() {
        return CartService.getCart().length;
      };
      
      this.logout = function() {
        UserService.destroy(function() {
          $location.path('/');
        }, function() {
          ngToast.danger({
            content: r.data.code + ' : ' + r.data.error,
            animation: 'slide'
          });
        })
      };
  }]);