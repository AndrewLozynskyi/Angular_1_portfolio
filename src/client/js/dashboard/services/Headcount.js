/*
 * @author ohmed, markiyan
 * Dashboard Headcount service
*/

angular.module( 'Dashboard.module' )

.service( 'headcount.service', [ '$http', '$rootScope', function ( $http, $rootScope ) {

    var service = {};

    var lineChart = [];
    var geoChart = [];
    var tableData = [];

    var countries = [];
    var departments = [];

    var employeesData = {};
    var countryDepartments = [];
    var departmentsStats = [];
    var selectedDate;
    var trends = { month: 0, year: 0, total: 0 };
    var activeEmployeeType = '';

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
            url: '/api/dashboard/headcount/getGeneralData',
            params: data
        }).then( function ( response ) {

            var data = response.data;

            // set trends

            trends.total = data.trends.total;
            trends.month = data.trends.month;
            trends.year = data.trends.year;

            // set line-chart data

            lineChart = data.linechartData.total;
            departmentsStats = angular.copy( data.linechartData );

            // set country data

            var dataResponse = data.countryData;
            var newCountriesList = [];
            var objCountries = countryList;

            function serchShotCountry ( name ) {

                for ( var item in objCountries ) {

                    if ( objCountries[ item ] === name.toUpperCase() ) {

                        return item;

                    }

                }

            };

            geoChart = [];

            for ( var e in dataResponse ) {

                geoChart.push({
                    country: e,
                    total: dataResponse[ e ].total,
                    short: serchShotCountry( e ) || e.toUpperCase()
                });

                newCountriesList.push( e );

            }

            countries = angular.copy( data.countryList );

            //

            var newDepartmentsList = [];

            for ( var departmentName in data.linechartData ) {

                if ( departmentName === 'total' ) continue;

                newDepartmentsList.push( departmentName )

            }

            departments = angular.copy( Object.keys( data.departmentList || {} ) ).filter( function ( value ) { return value !== 'total'; });

            // set country/department table

            var categories = angular.copy( departments );
            categories.push('Total');

            tableData = buildTableData( categories, countries, dataResponse );

            // set department data

            countryDepartments = [{
                name: 'Department',
                total: ''
            }];

            for ( var departmentName in data.departmentList ) {

                countryDepartments.push({
                    name: departmentName,
                    total: Math.round( data.departmentList[ departmentName ] )
                });
                
                angular.element( document )
                    .find('.dashboard-card').removeClass('add-shadow-position')

                angular.element( document )
                    .find('#dashboard-card').removeClass('add-shadow').addClass('hide-shadow')

                angular.element( document )
                    .find('.app-content').removeClass('add-shadow-scroll')
            
                $rootScope.showBackground = false;

            }

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
            url: '/api/dashboard/headcount/getEmployeesList',
            params: data
        }).then( function ( response ) {

            employeesData = response.data.employees;

        });

    };

    //

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

        if ( activeDepartments.length < 2 ) {

            service.setDepartmentUsers();

        }

    };

    //

    service.getDataGeoChart = function () {

        return geoChart;

    };

    service.getDataLineChart = function () {

        return lineChart;

    };

    service.getDepartmentsStats = function () {

        return departmentsStats;

    };

    service.getTrends = function () {

        return trends;

    };

    service.getDataTable = function () {

        return tableData;

    };

    service.getCountries = function () {

        return countries;

    };

    service.getDepartments = function () {

        return departments;

    };

    service.getCountriesDepartments = function () {

        return countryDepartments;

    };

    service.getEmployeesData = function () {

        return employeesData;

    };

    //

    function buildTableData ( departments, countries, data ) {

        var result = [];

        if ( ! countries.length ) return result;

        result.push( angular.copy( countries ) );
        result[0].unshift('Department/Country');

        departments.forEach( function ( department ) {

            result.push([ department ]);

            countries.forEach( function ( country ) {

                if ( department === 'Total' ) department = 'total';
                result[ result.length - 1 ].push( ( data[ country ] && data[ country ][ department ] ) || '-' );

            });

        });

        return result;

    };

    //

    return service;

}]);
