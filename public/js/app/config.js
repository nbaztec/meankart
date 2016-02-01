/**
 * @author nisheeth
 * @date 30 Sep 2015
 */

angular.module('meankart')
  .config(['$httpProvider', '$routeProvider', function($httpProvider, $routeProvider) {

    $routeProvider
      .when('/', {
        templateUrl: '/html/home.html'
      })
      .when('/login', {
        templateUrl: '/html/login.html'
      })
      .when('/register', {
        templateUrl: '/html/register.html'
      })
      .when('/products', {
        templateUrl: '/html/products.html'
      })
      .otherwise({
        redirectTo: '/'
      });

    $httpProvider.interceptors.push('AuthInterceptor');
  }]);