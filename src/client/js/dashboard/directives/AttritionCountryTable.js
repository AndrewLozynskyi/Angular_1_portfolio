/*
 * @author ohmed
 * Attrition country table directive
*/

angular.module( 'Dashboard.module' )

.directive( 'attritionCountryTable', [ function () {

    return {
        restrict: 'E',
        scope: {
            setData:        '=',
            selectCell:     '='
        },
        controllerAs: 'act',
        templateUrl: 'dashboard/directives/attrition-country-table.html',
        controller: [ '$scope', function ( $scope ) {

            var $this = this;

            $this.itemsPerPage = 10;
            $this.currentPage = 1;

            $this.maxPages = 0;
            $this.total = [];
            $this.countries = [];

            $this.selectCell = $scope.selectCell;

            //

            $this.setItemsPerPage = function ( value ) {

                $this.currentPage = 1;
                $this.itemsPerPage = value;
                $this.changePage();

            };

            $this.changePage = function () {

                if ( ! $scope.setData ) return;

                var data = angular.copy( $scope.setData );

                $this.total = data['total'];
                delete data['total'];

                $this.countries = Object.keys( data );
                var itemsPerPage = ( $this.itemsPerPage === 'all' ) ? $this.countries.length : $this.itemsPerPage;
                itemsPerPage = Math.min( itemsPerPage, $this.countries.length );

                $this.maxPages = Math.ceil( $this.countries.length / itemsPerPage );
                $this.countries = $this.countries.slice( ( $this.currentPage - 1 ) * itemsPerPage, $this.currentPage * itemsPerPage );

            };

            var setDataWatch = $scope.$watch( 'setData', function ( value ) {

                if ( value && Object.keys( value ).length ) {

                    $this.changePage();

                }

            });

        }]
    };

}]);
