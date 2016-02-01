/**
 * @author nisheeth
 * @date 30 Sep 2015
 */

angular.module('meankart')
  .controller('RegisterController', ['$http', '$window', 'ngToast', 'UserService', function($http, $window, ngToast, UserService) {
      this.doRegister = function (user) {
        console.log(user);

        UserService.create(user, function(r) {
          console.log(r.data);
          if (r.data.code === 200) {
            ngToast.success({
              content: 'User created! Redirecting...',
              animation: 'slide'
            });
            setTimeout(function(){
              $window.url('/login');
            }, 3000);
          } else {
            ngToast.danger({
              content: r.data.code + ' : ' + r.data.error,
              animation: 'slide'
            });
          }

        }, function(r) {
          console.log(r.data);
          ngToast.danger({
            content: r.data.code + ' : ' + r.data.message,
            animation: 'slide'
          });
        });
      }
  }]);