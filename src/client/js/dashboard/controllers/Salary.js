/*
 * @author ohmed
 * Dashboard:Salary page controller
*/

angular.module( 'Dashboard.module' )

.controller( 'salary.controller', [ '$scope', '$rootScope', 'salary.service', 'filters.factory', '$mdDialog','toaster', function ( $scope, $rootScope, salaryService, filters, $mdDialog,toaster  ) {

    var $this = this;

    this.getCountries = salaryService.getCountries;
    this.selectCountries = salaryService.selectCountries;
    this.getDepartments = salaryService.getDepartments;
    this.selectDepartments = salaryService.selectDepartments;

    this.getDepartmentsStats = salaryService.getDepartmentsStats;
    this.dataTable = salaryService.getDataTable;
    // this.employeesData = salaryService.getEmployeesData;
    this.updateData = salaryService.updateData;
    // this.getDepartmentStats = salaryService.getDepartmentStats;
    this.dataLineChart = salaryService.getDataLineChart;
    this.totalStatistic = { total: [ 35 ], voluntary: [ 27 ], involuntary: [ 8 ] }
    this.trends = salaryService.getTrends();
    this.getActiveData = salaryService.getActiveData;

    this.getActiveDepartments = salaryService.getActiveDepartments;
    this.getActiveCountries = salaryService.getActiveCountries;
    this.getDepartmentsSales = salaryService.getDepartmentsSales;
    this.getCountriesSales = salaryService.getCountriesSales;
    this.getDataDonutChart = salaryService.getDataDonutChart;
    this.getEmployeesList = salaryService.getEmployeesList;

    //

    this.activeParams = { countries: [], departments: [] };
    $this.activeParams = { countries: [], departments: [] };

    //

    this.showFilters = function () {

        $rootScope.filtersEnabled = true;

    };

    this.showTargetDialogue = function ( $event ) {

        $mdDialog.show({
            parent: angular.element( document.body ),
            targetEvent: $event,
            clickOutsideToClose: true,
            template: '<md-dialog class="target-popup" aria-label="Target popup"><target-popup></target-popup></md-dialog>'
        });

    };

    this.showUploadDialogue = function ( $event ) {

        $mdDialog.show({
            parent: angular.element( document.body ),
            targetEvent: $event,
            clickOutsideToClose: true,
            template: '<md-dialog class="uploadFiles" aria-label="Upload popup"><upload-popup url-to-pass="/api/dashboard/headcount/import" ></upload-popup></md-dialog>'
        });

    };

    this.showloginUser = function ( $event ) {

        $mdDialog.show({
            parent: angular.element( document.body ),
            targetEvent: $event,
            clickOutsideToClose: true,
            template: '<md-dialog class="user-l" aria-label="login user"><user-login></user-login></md-dialog>'
        });

    };

    //

    filters.setUpdateCallback( salaryService.updateData );
    salaryService.updateData( filters.getDateFilter() );

}]);
