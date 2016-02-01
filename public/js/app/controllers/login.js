/**
 * @author nisheeth
 * @date 30 Sep 2015
 */

angular.module('meankart')
  .controller('LoginController', ['$http', '$location', 'ngToast', 'UserService', function($http, $location, ngToast, UserService) {
      this.doLogin = function (user) {
        console.log(user);
        
         UserService.authenticate(user, function(r) {
          console.log(r.data);
          if (r.data.code === 200) {
            ngToast.success({
              content: 'Login successful! Redirecting...',
              animation: 'slide'
            });
            $location.path('/');
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
        /*
        $http.post('/api/user/authenticate', user)
          .then(function(r) {
            console.log(r.data);
            ngToast.dismiss(loader);
            if (r.data.code === 200) {
              ngToast.success({
                content: 'Login successful! Redirecting...',
                animation: 'slide'
              });
            } else {
              ngToast.danger({
                content: r.data.code + ' : ' + r.data.error,
                animation: 'slide'
              });
            }
            
          }, function(r) {
            console.log(r.data);
            ngToast.dismiss(loader);
            ngToast.danger({
              content: r.data.code + ' : ' + r.data.message,
              animation: 'slide'
            });
          });
          */
      }
  }]);