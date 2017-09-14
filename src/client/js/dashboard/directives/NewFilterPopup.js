/*
 * @author ohmed
 * Dashboard csv sheets upload dirrective
*/

angular.module( 'Dashboard.module' )

.directive( 'newFilterPopup', [ 'filters.service', function ( filtersService ) {

    return {
        restrict: 'E',
        scope: {},
        controllerAs: 'nfp',
        templateUrl: 'dashboard/directives/new-filter-popup.html',
        controller: [ '$scope', '$rootScope', '$mdDialog', function ( $scope, $rootScope, $mdDialog ) {

            var $this = this;

            $scope.title = '';

            $scope.create = function () {

                filtersService.create( $scope.title, function ( result ) {

                    if ( result.success ) {

                        $rootScope.filtersList = false;
                        $mdDialog.cancel();

                    }

                });

            };

            $scope.cancel = function () {

                $mdDialog.cancel();

            };

            // todo

        }]
    };

}]);
