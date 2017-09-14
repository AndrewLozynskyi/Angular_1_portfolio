/*
 * @author ohmed
 * 'Department list table' directive
*/

angular.module( 'Dashboard.module' )

.directive( 'departmentsListTable', [ function () {

    return {
        restrict: 'E',
        scope: {
            setData:                '=',
            activeParams:           '=',
            tableParams:            '=',
            selectDepartments:      '=',
            columns:                '='
        },
        controllerAs: 'dlt',
        templateUrl: 'dashboard/directives/departments-list-table.html',
        controller: [ '$scope', function ( $scope ) {

            var $this = this;

            $scope.itemsPerPage = 10;
            $this.currentPage = 1;
            $this.maxPages = 1;
            $this.itemsPerPage = 10;

            $scope.totalDepartment = {};
            $scope.departments = [];
            $scope.titles = [];

            //

            $this.changePage = function () {

                if ( ! $scope.setData[ 'total' ] ) return;

                $scope.titles.length = 0;
                $scope.departments.length = 0;

                // get total data

                var department = $scope.setData[ 'total' ];
                var lastIndex = ( department.total || department.headcount ).length - 1;
                var items = [];

                for ( var item in department ) {

                    items.push({
                        name:   capitalizeFirstLetter( item ),
                        value:  department[ item ][ lastIndex ]
                    });

                    $scope.titles.push( capitalizeFirstLetter( item ) );

                }

                $scope.totalDepartment = {
                    name:       'Total',
                    lineChart:  department,
                    items:      items
                };

                var data = angular.copy( $scope.setData );
                delete data['total'];

                // get department data

                var departmentsNames = Object.keys( data );
                $this.maxPages = Math.ceil( departmentsNames.length / $this.itemsPerPage );

                for ( var i = ( $this.currentPage - 1 ) * $this.itemsPerPage, il = Math.min( $this.currentPage * $this.itemsPerPage, departmentsNames.length ); i < il; i ++ ) {

                    department = $scope.setData[ departmentsNames[ i ] ];
                    lastIndex = ( department.total || department.headcount ).length - 1;

                    var items = {};

                    for ( var item in department ) {

                        items[ capitalizeFirstLetter( item ) ] = {
                            name:   capitalizeFirstLetter( item ),
                            value:  department[ item ][ lastIndex ]
                        };

                    }

                    department.total = department.total || department.headcount;

                    $scope.departments.push({
                        name:       departmentsNames[ i ],
                        lineChart:  department,
                        items:      items
                    });

                }

            };

            $this.selectDepartment = function ( departmentName, employeeType ) {

                employeeType = ( employeeType === 'Total' ) ? 'all' : employeeType;
                $scope.tableParams.type = employeeType || 'all';
                $scope.activeParams.departments = [ departmentName ];
                $scope.selectDepartments( $scope.activeParams.departments );

            };

            $this.setItemsPerPage = function ( value ) {

                $this.currentPage = 1;
                $this.itemsPerPage = value;
                $this.changePage();

            };

            //

            $scope.$watch( 'setData', function ( value ) {

                if ( value ) {

                    $this.changePage();

                }

            });

            //

            function capitalizeFirstLetter ( string ) {

                return string.charAt(0).toUpperCase() + string.slice(1);

            };

        }]
    };

}]);
