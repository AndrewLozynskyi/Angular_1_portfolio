/*
 * @author ohmed
 * Dashboard Salary service
*/

angular.module( 'Dashboard.module' )

.service( 'salary.service', [ '$http', '$rootScope', function ( $http, $rootScope ) {

    var service = {};

    var lineChart = {};
    var countryData = {};

    var countries = [];
    var departments = [];
    // var departmentsStats = [];
    var trends = { month: 0, year: 0, total: 0 };

    // var employeesData = {};

    var selectedDate;

    var activeCountries = [];
    var activeDepartments = [];

    var activeDepartmentsStats = [];
    var activeCountriesStats = [];
    var departmentsSales = [];
    var countrySales = [];
    var dataDonutChart = [];
    var employeesList = {};

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
            url: '/api/dashboard/salary/getGeneralData',
            params: data
        }).then( function ( response ) {

            var data = response.data;

            //

            trends.total = data.trends.total;
            trends.month = data.trends.month;
            trends.year = data.trends.year;

            departments = angular.copy( Object.keys( data.departmentData || {} ) ).filter( function ( value ) { return value !== 'total'; });

            countryDepartments = [];
            departmentsTable = [];
            departmentChartData = [];

            departmentCountries = [];
            countriesTable = [];
            countryChartData = [];
            donutData = [];

            // 
            
            dataDonutChart = data.departmentData.total[ data.departmentData.total.length - 1 ];

            for ( var departmentName in data.departmentData ) {

                countryDepartments.push({
                    department: departmentName,
                    salary:     data.departmentData[ departmentName ][data.departmentData[ departmentName ].length - 1 ].totalSalary
                });

                var departmentChartData = [];

                departmentChartData = ( data.departmentData[ departmentName ] ).map( function ( item ) {
                  
                    return item.avgSalary;

                });

                departmentsTable.push({
                    department:  departmentName,
                    salary:      data.departmentData[ departmentName ][data.departmentData[ departmentName ].length - 1 ],
                    salaryChart: departmentChartData
                });


            //

                activeDepartmentsStats = countryDepartments;
                departmentsSales = departmentsTable;

                angular.element( document ).find('.dashboard-card').removeClass('add-shadow-position')
                angular.element( document ).find('#dashboard-card').removeClass('add-shadow').addClass('hide-shadow')
                angular.element( document ).find('.app-content').removeClass('add-shadow-scroll')

                $rootScope.showBackground = false;

            };

            countries = angular.copy( Object.keys( data.countryData || {} ) ).filter( function ( value ) { return value !== 'total'; });

            for ( var countryName in data.countryData ) {

                departmentCountries.push({
                    country:    countryName,
                    salary:     data.countryData[ countryName ][data.countryData[ countryName ].length - 1 ].totalSalary
                });

                var countryChartData = [];

                countryChartData = ( data.countryData[ countryName ] ).map( function ( item ) {
                  
                    return item.avgSalary;

                });

                countriesTable.push({
                    country:     countryName,
                    salary:      data.countryData[ countryName ][data.countryData[ countryName ].length - 1 ],
                    salaryChart: countryChartData
                });


            //

                activeCountriesStats = departmentCountries;
                countrySales = countriesTable;

                angular.element( document ).find('.dashboard-card').removeClass('add-shadow-position')
                angular.element( document ).find('#dashboard-card').removeClass('add-shadow').addClass('hide-shadow')
                angular.element( document ).find('.app-content').removeClass('add-shadow-scroll')

                $rootScope.showBackground = false;

            };

            var data = {
                year:           selectedDate.year,
                month:          selectedDate.month - 1,
                day:            selectedDate.day,
                countries:      activeCountries.join('|'),
                departments:    activeDepartments.join('|')
            };

            $http({
                method: 'GET',
                url: '/api/dashboard/salary/getEmployeesList',
                params: data
            })
            .then( function ( response ) {

                employeesList = response.data.employees;

            })

            refreshButton.removeClass( 'refreshing-button-animation' );

        });

    };

    service.getEmployeesList = function () {

        return employeesList;
    }

    service.setDepartmentUsers = function ( page, itemsPerPage ) {

        // todo

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

    // service.getDepartmentsStats = function () {

    //     return departmentsStats;

    // };

    service.getTrends = function () {

        return trends;

    };

    service.getCountries = function () {

        return countries;

    };

    service.getDepartments = function () {

        return departments;

    };

    service.getActiveDepartments = function () {

        return activeDepartmentsStats;

    }

    service.getActiveCountries = function () {

        return activeCountriesStats;

    }

    service.getDepartmentsSales = function () {

        return departmentsSales;

    }

    service.getCountriesSales = function () {

        return countrySales;

    }

    service.getDataDonutChart = function () {

        return dataDonutChart;

    }

    // service.getEmployeesData = function () {

    //     return employeesData;

    // };

    service.getDataLineChart = function () {

        return lineChart;

    };

    //

    return service;

}]);
