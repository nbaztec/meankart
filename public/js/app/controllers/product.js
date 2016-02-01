/**
 * @author nisheeth
 * @date 30 Sep 2015
 */

angular.module('meankart')
  .controller('ProductController', ['$scope', '$http', '$location', 'ngToast', 'ProductService', 
    function($scope, $http, $location, ngToast, ProductService) {
      var self = this;
      this.products = [];

      ProductService.page(0);
    
      /*
      setTimeout(function(){
        $scope.products.push({name: 'bar'});
      }, 3000);
      */
      this.fetchProducts = function () {
        
         ProductService.list(function(r) {
          console.log(r.data);
          if (r.data.code === 200) {
            /*
            ngToast.success({
              content: 'Login successful! Redirecting...',
              animation: 'slide'
            });
            */
            self.products = self.products.concat(r.data.products);
            ProductService.nextPage();
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
      };

      this.fetchProducts();
  }]);