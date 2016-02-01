/**
 * @author nisheeth
 * @date 30 Sep 2015
 */

angular.module('meankart')
  .directive('compareTo', function() {
    return  {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        compareTo: '='
      },
      link: function(scope, element, attr, ngModel) {
        ngModel.$validators.compareTo = function(v) {
          return v === scope.compareTo;
        };
        
        scope.$watch('compareTo', function() {
          ngModel.$validate();
        });
      }
    }
  });