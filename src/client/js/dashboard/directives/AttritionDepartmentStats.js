/*
 * @author ohmed
 * Attrition departments stats directive
*/

angular.module( 'Dashboard.module' )

.directive( 'attritionDepartmentStats', [ function () {

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
        controllerAs: 'ads',
        templateUrl: 'dashboard/directives/attrition-department-stats.html',
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

            $this.changePage = function () {

                $scope.getEmployees( $this.currentPage );

            };

            $this.updateDepartmentsData = function () {

                if ( ! $scope.departmentData || ! $scope.departmentData[ $this.activeParams.departments[0] ] ) return;

                var lastMonth = $scope.departmentData['total'].headcount.length - 1;
                $this.leftMenuItems.length = 0;
                $this.departmentData = {};

                for ( var item in $scope.departmentData[ $this.activeParams.departments[0] ] ) {

                    $this.departmentData[ item.toLowerCase() ] = Math.round( $scope.departmentData[ $this.activeParams.departments[0] ]['headcount'][ lastMonth ] * $scope.departmentData[ $this.activeParams.departments[0] ][ item ][ lastMonth ] / 100 );

                    if ( item !== 'total' ) {

                        $this.leftMenuItems.push( item.toLowerCase() );

                    }

                }

                $scope.departmentData[ $this.activeParams.departments[0] ].total = $scope.departmentData.total[ $scope.tableParams.type ];
                $this.departmentData.lineChart = angular.copy( $scope.departmentData[ $this.activeParams.departments[0] ] );

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
