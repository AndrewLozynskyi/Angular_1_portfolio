/*
 * @author ohmed, markiyan
 * Dashboard:Headcount page controller
*/

angular.module( 'Dashboard.module' )

.controller( 'headcount.controller', [ '$scope', '$rootScope', 'headcount.service', 'filters.factory', '$mdDialog', function ( $scope, $rootScope, headcountService, filters, $mdDialog ) {

    var $this = this;

    this.getCountries = headcountService.getCountries;
    this.selectCountries = headcountService.selectCountries;
    this.getDepartments = headcountService.getDepartments;
    this.selectDepartments = headcountService.selectDepartments;
    this.getDepartmentsStats = headcountService.getDepartmentsStats;
    this.dataLineChart = headcountService.getDataLineChart;
    this.dataGeoChart = headcountService.getDataGeoChart;
    this.dataTable = headcountService.getDataTable;
    this.getCountriesDepartments = headcountService.getCountriesDepartments;
    this.employeesData = headcountService.getEmployeesData;
    this.updateData = headcountService.updateData;
    this.setDepartmentUsers = headcountService.setDepartmentUsers;
    this.trends = headcountService.getTrends();

    //

    this.activeParams = { countries: [], departments: [] };
    $scope.activeParams = $this.activeParams;
    $this.tableParams = { type: 'all' };
    this.headcountTitle = { country: '', department: '' };
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

    this.selectCountryDepartment = function ( country, department ) {

        $scope.activeParams.countries = ( country ) ? [ country ] : [];
        $scope.activeParams.departments = ( department ) ? [ department ] : [];

        headcountService.selectCountries( $scope.activeParams.countries.filter( function ( value ) { return value !== 'all'; }) );
        headcountService.selectDepartments( $scope.activeParams.departments.filter( function ( value ) { return value !== 'all'; }) );

    };

    //

    filters.setUpdateCallback( headcountService.updateData )
    headcountService.updateData( filters.getDateFilter() );

}]);
