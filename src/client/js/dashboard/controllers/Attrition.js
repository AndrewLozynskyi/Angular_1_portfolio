/*
 * @author ohmed
 * Dashboard:Attrition page controller
*/

angular.module( 'Dashboard.module' )

.controller( 'attrition.controller', [ '$scope', '$rootScope', 'attrition.service', 'filters.factory', '$mdDialog', function ( $scope, $rootScope, attritionService, filters, $mdDialog ) {

    var $this = this;

    this.getCountries = attritionService.getCountries;
    this.selectCountries = attritionService.selectCountries;
    this.getDepartments = attritionService.getDepartments;
    this.selectDepartments = attritionService.selectDepartments;
    this.getDepartmentsStats = attritionService.getDepartmentsStats;
    this.getDepartmentStats = attritionService.getDepartmentStats;
    this.getCountryData = attritionService.getCountryData;
    this.dataLineChart = attritionService.getDataLineChart;
    this.setDepartmentUsers = attritionService.setDepartmentUsers;
    this.updateData = attritionService.updateData;
    this.employeesData = attritionService.getEmployeesData;
    this.trends = attritionService.getTrends();

    //

    this.activeParams = { countries: [], departments: [] };
    $scope.activeParams = $this.activeParams;
    $this.tableParams = { type: 'voluntary' };
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

    this.showloginUser = function ( $event ) {

        $mdDialog.show({
            parent: angular.element( document.body ),
            targetEvent: $event,
            clickOutsideToClose: true,
            template: '<md-dialog class="user-l" aria-label="login user"><user-login></user-login></md-dialog>'
        });

    };

    this.selectCountryPersonType = function ( country ) {

        $scope.activeParams.countries = ( country ) ? [ country ] : [];
        $scope.activeParams.departments = [];

        headcountService.selectCountries( $scope.activeParams.countries );
        headcountService.selectDepartments( $scope.activeParams.departments );

    };

    //

    filters.setUpdateCallback( attritionService.updateData );
    attritionService.updateData( filters.getDateFilter() );

}]);
