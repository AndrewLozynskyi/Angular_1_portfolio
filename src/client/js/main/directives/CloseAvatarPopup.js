/*
 * @author ohmed, vova
 * Profile avatar change popup close directive
*/

angular.module( 'hrTools' )

.directive( 'closeAvatarPopup', [ function () {

    return {
        restrict: 'E',
        scope: {},
        controllerAs: 'cap',
        templateUrl: 'main/directives/close-window.html',
        controller: [ '$mdDialog', '$scope', '$rootScope', function ( $mdDialog, $scope, $rootScope ) {

            var $this = this;

            //

            $this.cancel = function () {

                $mdDialog.cancel();

            };

            $this.close = function () {

                $rootScope.$broadcast( 'hidePopup' );
                $mdDialog.hide();

            };

        }]
    };

}]);
