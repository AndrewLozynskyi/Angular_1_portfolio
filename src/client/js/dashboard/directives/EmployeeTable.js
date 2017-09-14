/*
 * @author ohmed, jesus
 * Employee table directive
*/

angular.module( 'Dashboard.module' )

.directive( 'employeeTable', [ 'headcount.service', function ( headcountService ) {

    return {

        restrict: 'E',
        scope: {
            activeParams:       '=',
            setSidebarData:     '=',
            setEmployeesData:   '=',
            setDepartments:     '=',
            selectDepartments:  '=',
            title:              '='
        },
        controllerAs: 'em',
        templateUrl: 'dashboard/directives/employee-table.html',
        controller: [ '$scope', function ( $scope ) {

            var $this = this;

            $this.activeCategory = ( $scope.activeParams.departments[0] ) ? $scope.activeParams.departments[0] : false;
            $this.chartData = {};
            $this.tableData = [];

            $this.currentPage = 1;
            $this.itemsPerPage = 10;

            //

            $this.setItemsPerPage = function ( value ) {

                $this.currentPage = 1;
                $this.itemsPerPage = value;
                $this.changePage();

            };

            $this.mark = function ( event ) {

                $this.activeCategory = angular.element( event.target ).find('.department').text();

                if ( $this.activeCategory !== 'Total' ) {

                    $scope.activeParams.departments = [ $this.activeCategory ];

                } else {

                    $scope.activeParams.departments = [];

                }

                $scope.selectDepartments( $scope.activeParams.departments );

            };

            $this.changePage = function () {

                headcountService.setDepartmentUsers( $this.currentPage, '', $this.itemsPerPage );

            };

            //

            $scope.$watch('setDepartments', function ( value ) {

                var departmentName = angular.element('employee-table md-list-item.active .nameDepartment').text();
                if ( departmentName === 'Total' || departmentName === '' ) departmentName = 'total';
                if ( ! value || ! value[ departmentName ] ) return;

                $this.chartData = value[ departmentName ];

            });

            $scope.$watch('setEmployeesData', function ( value ) {

                if ( ! value || ! value.list ) return;

                $this.maxPages = Math.ceil( value.total / $this.itemsPerPage );
                $this.tableData = value.list;

            });

        }]
    };

}]);
