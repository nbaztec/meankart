/**
 * @author nisheeth
 * @date 30 Sep 2015
 */

angular.module('meankart')
  .run(['UserService', function(User) {
    User.session();
  }]);