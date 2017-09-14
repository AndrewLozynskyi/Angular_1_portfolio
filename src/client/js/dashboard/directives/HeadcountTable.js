/*
 * @author ohmed
 * Headcount table directive
*/

angular.module( 'Dashboard.module' )

.directive( 'headcountTable', [ function () {

    return {
        restrict: 'E',
        scope: {
            setData:        '=',
            selectCell:     '='
        },
        controllerAs: 'tc',
        templateUrl: 'dashboard/directives/headcount-table.html',
        controller: [ '$scope', function ( $scope ) {

            var $this = this;

            $this.columnsNum = $('headcount-table .main-table th:visible').length;

            $this.itemsPerPage = 10;
            $this.currentPage = 1;
            $this.hOffset = 0;

            $this.maxPages = 0;
            $this.total = [];
            $this.titles = [];
            $this.departments = [];
            $this.departmentsSum = {};

            $this.selectCell = $scope.selectCell;

            //

            $this.setItemsPerPage = function ( value ) {

                $this.currentPage = 1;
                $this.itemsPerPage = value;
                $this.changePage();

            };

            $this.moveTableHorisontal = function ( direction ) {

                $this.columnsNum = $('headcount-table .main-table th:visible').length;

                $this.hOffset += direction;
                $this.hOffset = Math.min( $this.hOffset, $scope.setData[0].length - $this.columnsNum );
                $this.hOffset = Math.max( $this.hOffset, 0 );

                $this.changePage();

            };

            $this.changePage = function () {

                if ( ! $scope.setData || ! $scope.setData[0] ) return;

                $this.columnsNum = Math.min( 10, $scope.setData[0].length );

                var itemsPerPage = ( $this.itemsPerPage === 'all' ) ? $scope.setData.length - 2 : $this.itemsPerPage;
                itemsPerPage = Math.min( itemsPerPage, $scope.setData.length - 2 );

                $this.maxPages = Math.ceil( ( $scope.setData.length - 3 ) / itemsPerPage );
                $this.departments = [];
                $this.total = [];
                $this.titles = [];

                // add header row

                $this.titles.push( $scope.setData[0][0] );

                for ( var j = $this.hOffset + 1; j < $this.hOffset + $this.columnsNum; j ++ ) {

                    $this.titles.push( $scope.setData[0][ j ] );

                }

                // add department/country data

                for ( var i = 1 + itemsPerPage * ( $this.currentPage - 1 ), il = i + itemsPerPage; i < il; i ++ ) {

                    if ( ! $scope.setData[ i ] ) continue;

                    if ( $scope.setData[ i ][0] !== 'Total' ) {

                        var row = [];
                        row.push( $scope.setData[ i ][0] );

                        for ( var j = $this.hOffset + 1; j < $this.hOffset + $this.columnsNum; j ++ ) {

                            row.push( $scope.setData[ i ][ j ] );

                        }

                        $this.departments.push( row );

                    }

                }

                // add total info

                for ( var j = $this.hOffset + 1; j < $this.hOffset + $this.columnsNum; j ++ ) {

                    $this.total.push( $scope.setData[ $scope.setData.length - 1 ][ j ] );

                }

            };

            var setDataWatch = $scope.$watch( 'setData', function ( value ) {

                if ( value && value.length ) {

                    $this.columnsNum = $('headcount-table .main-table th:visible').length;

                    for ( var i = 0, il = $scope.setData.length; i < il; i ++ ) {

                        $this.departmentsSum[ $scope.setData[ i ][0] ] = 0;

                        for ( var j = 1, jl = $scope.setData[ i ].length; j < jl; j ++ ) {

                            if ( $scope.setData[ i ][ j ] === '-' ) continue;
                            $this.departmentsSum[ $scope.setData[ i ][0] ] += $scope.setData[ i ][ j ];

                        }

                    }

                    $this.changePage();

                }

            });

        }]
    };

}]);
