/*
 * @author ohmed
 * Notification directive
*/

angular.module( 'hrTools' )

.directive( 'notificationMenu', [ function () {

    return {
        restrict: 'E',
        templateUrl: 'main/directives/notification-menu.html',
        link: function ( scope, element ) {

            scope.openMenu = function () {

                angular.element( 'md-tab-item' ).attr( 'md-prevent-menu-close', 'md-prevent-menu-close' );

            };

        }
    };

}]);
