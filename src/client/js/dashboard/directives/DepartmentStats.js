/*
 * @author ohmed
 * Departments stats directive
*/

angular.module( 'Dashboard.module' )

.directive( 'departmentStats', [ function () {

    return {
        restrict: 'E',
        scope: {
            employeesData:          '=',
            departmentData:         '=',
            getEmployees:           '=',
            activeParams:           '=',
            tableParams:            '=',
            title:                  '='
        },
        controllerAs: 'ds',
        templateUrl: 'dashboard/directives/department-stats.html',
        controller: [ '$scope', function ( $scope ) {

            var $this = this;

            $this.activeParams = $scope.activeParams;
            $this.departmentData = $scope.departmentData;
            $this.tableParams = $scope.tableParams;
            $this.tableData = [];
            $this.leftMenuItems = [];

            $this.currentPage = 1;
            $this.itemsPerPage = 10;

            //

            $this.setItemsPerPage = function ( value ) {

                $this.currentPage = 1;
                $this.itemsPerPage = value;
                $this.changePage();

            };

            $this.selectEmployeeType = function ( type ) {

                $this.currentPage = 1;
                $scope.getEmployees( 1, type );
                $this.tableParams.type = type.toLowerCase();

            };

            $this.getEmployees = function ( event ) {

                if ( $scope.category ) {

                    var selectedCategory = angular.element( event.target ).find('.nameDepartment').text();
                    $scope.changeCategory( $scope.activeParams.department, $this.currentPage, selectedCategory );

                } else {

                    var department = angular.element( event.target ).find('.nameDepartment').text();
                    $this.currentPage = 1;

                }

            };

            $this.changePage = function () {

                $scope.getEmployees( $this.currentPage );

            };

            $this.updateDepartmentsData = function () {

                if ( ! $scope.departmentData || ! $scope.departmentData[ $this.activeParams.departments[0] ] ) return;

                var lastMonth = $scope.departmentData[ $this.activeParams.departments[0] ].total.length - 1;
                $this.leftMenuItems.length = 0;
                $this.departmentData = {};

                for ( var item in $scope.departmentData[ $this.activeParams.departments[0] ] ) {

                    $this.departmentData[ item.toLowerCase() ] = $scope.departmentData[ $this.activeParams.departments[0] ][ item ][ lastMonth ];

                    if ( item !== 'total' ) {

                        $this.leftMenuItems.push( item.toLowerCase() );

                    }

                }

                var chartData = angular.copy( $scope.departmentData[ $this.activeParams.departments[0] ] );
                chartData.total = $scope.departmentData[ $this.activeParams.departments[0] ][ $this.tableParams.type ] || $scope.departmentData[ $this.activeParams.departments[0] ].headcount || $scope.departmentData[ $this.activeParams.departments[0] ].total;
                $this.departmentData.lineChart = chartData;

            };

            $scope.$watch( 'departmentData', $this.updateDepartmentsData );
            $scope.$watch( 'activeParams', $this.updateDepartmentsData, true );

            $scope.$watch('employeesData', function ( value ) {

                if ( ! value || ! value.list ) return;

                if ( $scope.activeParams.departments.length > 1 ) {

                    return;

                }

                $this.maxPages = Math.ceil( value.total / $this.itemsPerPage );
                $this.tableData = value.list;
                $this.updateDepartmentsData();

            });

            if ( $this.tableParams.type.toLowerCase() !== 'all' ) {

                $this.selectEmployeeType( $this.tableParams.type );

            }

        }]
    };

}]);
