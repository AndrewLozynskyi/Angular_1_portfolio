/*
 * @author ohmed
 * Dashboard target popup dirrective
*/

angular.module( 'Dashboard.module' )

.directive( 'filterList', [ 'filters.service', function ( filtersService ) {

    return {
        restrict: 'E',
        scope: {},
        controllerAs: 'up',
        templateUrl: 'dashboard/directives/filter-list.html',
        controller: [ '$scope', '$rootScope', '$mdDialog', function ( $scope, $rootScope, $mdDialog ) {

            var $this = this;

            $this.refreshFilterList = function ( force ) {

                if ( $rootScope.filtersList === false || force === true ) {

                    filtersService.getList( function ( response ) {

                        $rootScope.filtersList = response;
                        $this.filtersList = $rootScope.filtersList;

                    });

                }

            };

            $this.removeFilter = function ( id ) {

                filtersService.remove( id, function () {

                    $this.refreshFilterList( true );

                });

            };

            this.showFilterDialogue = function ( $event ) {

                $mdDialog.show({
                    parent: angular.element( document.body ),
                    targetEvent: $event,
                    clickOutsideToClose: false,
                    template: '<md-dialog class="filter-popup" aria-label="Target popup"><filter-popup></filter-popup></md-dialog>'
                });

            };

            this.showNewFilterDialogue = function ( $event ) {

                $mdDialog.show({
                    parent: angular.element( document.body ),
                    targetEvent: $event,
                    clickOutsideToClose: false,
                    template: '<md-dialog class="new-filter-popup" aria-label="New filter popup"><new-filter-popup></new-filter-popup></md-dialog>'
                });

            };

            $scope.toggleFormula = function () {

                this.toggle = ! this.toggle;

            };

            $rootScope.$watch( 'filtersList', $this.refreshFilterList );

            //

            $this.refreshFilterList();

        }]
    };

}]);
