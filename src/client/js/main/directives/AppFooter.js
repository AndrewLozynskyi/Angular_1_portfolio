/*
 * @author ohmed
 * Footer directive
*/

angular.module( 'hrTools' )

.directive( 'appFooter', [ function () {

    return {
        restrict: 'E',
        templateUrl: 'main/directives/footer.html',
        link: function ( scope, element ) {}
    };

}]);
