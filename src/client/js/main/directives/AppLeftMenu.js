/*
 * @author ohmed
 * Left menu directive
*/

angular.module( 'hrTools' )

.directive( 'appLeftMenu', [ function () {

    return {
        restrict: 'E',
        templateUrl: 'main/directives/left-menu.html',
        controller: [ '$scope', '$mdDialog', function ( $scope, $mdDialog ) {

            $scope.uploadCompanyLogo = function ( $event ) {

                $mdDialog.show({
                    skipHide: true,
                    parent: angular.element( document.body ),
                    template: '<md-dialog class="client-logo" aria-label="photo"><client-logo-popup></client-logo-popup></md-dialog>',
                    targetEvent: event,
                    clickOutsideToClose: true
                });

            };

        }]
    };

}]);
