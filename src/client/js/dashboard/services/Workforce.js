/*
 * @author ohmed, vova
 * Dashboard Workforce service
*/

angular.module( 'Dashboard.module' )

.service( 'workforce.service', [ '$http', '$rootScope', function ( $http, $rootScope ) {

    var service = {};

    var lineChart = [];
    var pieChart = [];
    var tableData = [];

    var countries = [];
    var departments = [];

    var countryDepartments = [];
    var departmentsStats = [];
    var chartStatistic = false;
    var chartCount = false;
    var trends = { month: 0, year: 0, total: 0 };

    var geoChart = {};
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
            url: '/api/dashboard/workforce/getGeneralData',
            params: data
        }).then( function ( response ) {

            var data = response.data;

            // set trends

            trends.total = data.trends.total;
            trends.month = data.trends.month;
            trends.year = data.trends.year;

            // set line-chart data

            lineChart = data.linechartData.total;
            departmentsStats = angular.copy( data.linechartDataPType );

            // set country data

            var dataResponse = data.countryData;
            var objCountries = countryList;

            function serchShotCountry ( name ) {

                for ( var item in objCountries ) {

                    if ( objCountries[ item ] === name.toUpperCase() ) {

                        return item;

                    }

                }

            };

            countries = angular.copy( data.countryList );

            //

            departments = angular.copy( Object.keys( data.departmentList || {} ) ).filter( function ( value ) { return value !== 'total'; });

            // set country/department table

            var categories = angular.copy( departments );
            categories.push('Total');

            // set department data

            countryDepartments = [{
                name: 'Department',
                total: ''
            }];

            service.processChartStatistics( data.dataByPersonType );

            for ( var departmentName in data.departmentList ) {

                countryDepartments.push({
                    name: departmentName,
                    total: data.departmentList[ departmentName ]
                });

            }

            refreshButton.removeClass( 'refreshing-button-animation' );

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
            url: '/api/dashboard/workforce/getEmployeesList',
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

        if ( activeDepartments.length < 2 ) {

            service.setDepartmentUsers();

        }

    };

    service.processChartStatistics = function ( chartsResponse ) {

        var objCountries = countryList;

        function serchShotCountry ( name ) {

            if ( name === 'Dubai' ) name = 'UNITED ARAB EMIRATES'; // delete after db update

            for ( var item in objCountries ) {

                if ( objCountries[ item ] === name.toUpperCase() ) {

                    return item;

                }

            }

        };

        var totalAll = 0;
        var rangeColor = ['#6be8e9', '#c3ee04' , '#ff8710', '#662d91'];

        for ( var e in chartsResponse ) {

            for ( var i = 0; i < chartsResponse[ e ].countries.length; i ++ ) {

                chartsResponse[ e ].countries[ i ].centered = serchShotCountry( chartsResponse[ e ].countries[ i ].country ) || chartsResponse[ e ].countries[ i ].country.toUpperCase();

            }

            totalAll += chartsResponse[ e ].total;

        }

        for ( var i = 0; i < chartsResponse.length; i ++ )  {

            chartsResponse[ i ].totalAll = totalAll;
            chartsResponse[ i ].color = rangeColor[ i % 4 ];

        }

        chartStatistic = chartsResponse;
        chartCount = chartStatistic.length;

        // table data

        tableData = [];
        var countries = [];
        tableData[ 0 ] = [ 'Country' ];

        for ( var i = 0; i < chartsResponse.length; i ++ ) {

            tableData[ 0 ].push( chartsResponse[ i ].person_type );

            for ( var j = 0; j < chartsResponse[ i ].countries.length; j ++ ) {

                if ( countries.indexOf( chartsResponse[ i ].countries[ j ].country ) === -1 )
                    countries.push( chartsResponse[ i ].countries[ j ].country );

            }

        }

        for ( var i = 0; i < countries.length; i ++ ) {

            tableData[ i + 1 ] = [];
            tableData[ i + 1 ][ 0 ] = countries[ i ];

            for ( var j = 1; j < tableData[ 0 ].length; j ++ ) {

                tableData[ i + 1 ][ j ] = '-';

            }

        }

        tableData[ tableData.length ] = [ 'Total' ];

        for ( var i = 0; i < chartsResponse.length; i ++ ) {

            for ( var j = 0; j < chartsResponse[ i ].countries.length; j ++ ) {

                tableData[ countries.indexOf( chartsResponse[ i ].countries[ j ].country ) + 1 ][ i + 1 ] = chartsResponse[ i ].countries[ j ].count;

            }

            tableData[ tableData.length - 1 ][ i + 1 ] = chartsResponse[ i ].total;

        }

        // pie chart

        pieChart = chartsResponse;

    };

    service.getDepartmentsStats = function () {

        return departmentsStats;

    };

    service.getChartStatistic = function () {

        return chartStatistic;

    };

    service.getDataPieChart = function () {

        return pieChart;

    };

    service.getDataGeoChart = function () {

        return geoChart;

    };

    service.getDataLineChart = function () {

        return lineChart;

    };

    service.getDataTable = function () {

        return tableData;

    };

    service.getCountries = function () {

        return countries;

    };

    service.getTrends = function () {

        return trends;

    };

    service.getTotalStatistic = function () {

        return totalStatistic;

    };

    service.getChartStatistic = function () {

        return chartStatistic;

    };

    service.getDepartments = function () {

        return departments;

    };

    service.getCountryDepartments = function () {

        return countryDepartments;

    };

    service.getEmployeesData = function () {

        return employeesData;

    };

    service.getChartCount = function () {

        return chartCount;

    };

    //

    return service;

}]);
