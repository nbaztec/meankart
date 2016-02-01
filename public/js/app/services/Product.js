/**
 * @author nisheeth
 * @date 30 Sep 2015
 */

angular.module('meankart')
  .factory('ProductService', ['$http', 'AuthService', function($http, AuthService) {
      var self = {
        _page: 0,
        page: function(p) {
          self._page = p;
        },

        nextPage: function() {
          self._page++;
        },
        
        list: function(success, error) {
          $http.post('/api/product/list', {page: self._page})
            .then(success, error);
        }
      };
    return self;
  }]);