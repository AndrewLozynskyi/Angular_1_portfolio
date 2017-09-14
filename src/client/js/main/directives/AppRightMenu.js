/*
 * @author ohmed
 * Right menu directive
*/

angular.module( 'hrTools' )

.directive( 'appRightMenu', [ function () {

    return {
        restrict: 'E',
        templateUrl: 'main/directives/right-menu.html',
        link: function ( scope, element ) {}
    };

}]);
