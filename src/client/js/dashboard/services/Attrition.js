/*
 * @author ohmed
 * Dashboard Attrition service
*/

angular.module( 'Dashboard.module' )

.service( 'attrition.service', [ '$http', '$rootScope', function ( $http, $rootScope ) {

    var service = {};

    var lineChart = {};
    var countryData = {};

    var countries = [];
    var departments = [];
    var departmentsStats = [];
    var departmentStats = {};
    var trends = { month: 0, year: 0, total: 0 };

    var employeesData = {};
    var activeEmployeeType = '';

    var selectedDate;
    var activeCountries = [];
    var activeDepartments = [];

    //

    service.getGeneralInfo = function ( callback ) {

        var refreshButton = angular.element( '#dashboard-button-refresh' );

        var data = {
            year:           selectedDate.year,
            month:          selectedDate.month - 1,
            day:            selectedDate.day,
            countries:      activeCountries.join('|'),
            departments:    activeDepartments.join('|')
        };

        //

        refreshButton.addClass( 'refreshing-button-animation' );

        $http({
            method: 'GET',
            url: '/api/dashboard/attrition/getGeneralData',
            params: data
        }).then( function ( response ) {

            var data = response.data;

            //

            trends.total = data.trends.total;
            trends.month = data.trends.month;
            trends.year = data.trends.year;

            //

            lineChart = data.linechartData.total;
            departmentsStats = angular.copy( data.linechartData );
            departmentStats = angular.copy( data.linechartData );

            //

            countryData = data.countryData;
            countries = angular.copy( data.countryList );
            departments = angular.copy( Object.keys( data.departmentList || {} ) ).filter( function ( value ) { return value !== 'total'; });

            //

            angular.element( document )
                .find('.dashboard-card').removeClass('add-shadow-position')

            angular.element( document )
                .find('#dashboard-card').removeClass('add-shadow').addClass('hide-shadow')

            angular.element( document )
                .find('.app-content').removeClass('add-shadow-scroll')
        
            $rootScope.showBackground = false;

            refreshButton.removeClass( 'refreshing-button-animation' );

        });

    };

    service.setDepartmentUsers = function ( page, employeeType, itemsPerPage ) {

        activeEmployeeType = employeeType || activeEmployeeType;

        var data = {
            year:           selectedDate.year,
            month:          selectedDate.month - 1,
            day:            selectedDate.day,
            countries:      activeCountries.join('|'),
            departments:    activeDepartments.join('|'),
            page:           ( page - 1 ) || 0,
            itemsPerPage:   itemsPerPage || 10,
            employeeType:   activeEmployeeType
        };

        //

        $http({
            method: 'GET',
            url: '/api/dashboard/attrition/getEmployeesList',
            params: data
        }).then( function ( response ) {

            employeesData = response.data.employees;

        });

    };

    service.updateData = function ( dateFilter ) {

        selectedDate = selectedDate || dateFilter;
        service.selectDepartments( activeDepartments );

    };

    service.selectCountries = function ( countries ) {

        activeCountries = countries;
        service.getGeneralInfo();

        if ( activeDepartments.length < 2 ) {

            service.setDepartmentUsers();

        }

    };

    service.selectDepartments = function ( departments ) {

        activeDepartments = departments;
        service.getGeneralInfo();

        if ( activeDepartments.length === 1 ) {

            service.setDepartmentUsers();

        }

    };

    service.getDataLineChart = function () {

        return lineChart;

    };

    service.getCountryData = function () {

        return countryData;

    };

    service.getDepartmentStats = function () {

        return departmentStats;

    };

    service.getDepartmentsStats = function () {

        return departmentsStats;

    };

    service.getEmployeesData = function () {

        return employeesData;

    };

    service.getTrends = function () {

        return trends;

    };

    service.getCountries = function () {

        return countries;

    };

    service.getDepartments = function () {

        return departments;

    };

    //

    return service;

}]);
