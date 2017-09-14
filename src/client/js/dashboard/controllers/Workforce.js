/*
 * @author ohmed, markiyan
 * Dashboard:Workforce page controller
*/

angular.module( 'Dashboard.module' )

.controller( 'workforce.controller', [ '$scope', 'workforce.service', 'filters.factory', '$mdDialog', function ( $scope, workforceService, filters, $mdDialog ) {

    var $this = this;

    this.getCountries = workforceService.getCountries;
    this.selectCountries = workforceService.selectCountries;
    this.getDepartments = workforceService.getDepartments;
    this.selectDepartments = workforceService.selectDepartments;
    this.getDepartmentsStats = workforceService.getDepartmentsStats;
    this.dataLineChart = workforceService.getDataLineChart;
    this.dataGeoChart = workforceService.getDataGeoChart;
    this.dataTable = workforceService.getDataTable;
    this.employeesData = workforceService.getEmployeesData;
    this.updateData = workforceService.updateData;
    this.getChartStatistic = workforceService.getChartStatistic;
    this.dataPieChart = workforceService.getDataPieChart;
    this.setDepartmentUsers = workforceService.setDepartmentUsers;
    this.trends = workforceService.getTrends();
    this.chartCount = workforceService.getChartCount;

    //

    this.activeParams = { countries: [], departments: [] };
    $scope.activeParams = $this.activeParams;
    $this.tableParams = { type: 'all' };
    this.workforceTitle = { country: '', department: '' };

    //

    this.showUploadDialogue = function ( $event ) {

        $mdDialog.show({
            parent: angular.element( document.body ),
            targetEvent: $event,
            clickOutsideToClose: true,
            template: '<md-dialog class="uploadFiles" aria-label="Upload popup"><upload-popup url-to-pass="/api/dashboard/workforce/import"></upload-popup></md-dialog>'
        });

    };

    this.selectCountryPersonType = function ( personType, country ) {

        $scope.activeParams.countries = ( country ) ? [ country ] : [];
        $scope.activeParams.departments = [];

        workforceService.selectCountries( $scope.activeParams.countries.filter( function ( value ) { return value !== 'all'; }) );
        workforceService.selectDepartments( $scope.activeParams.departments.filter( function ( value ) { return value !== 'all'; }) );

    };

    //

    filters.setUpdateCallback( workforceService.updateData );
    workforceService.updateData( filters.getDateFilter() );

}]);
