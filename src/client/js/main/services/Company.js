/*
 * @author ohmed
 * General company service api methods
*/

angular.module( 'hrTools' )

.service( 'company.service', [ '$http', function ( $http ) {

    var service = {};

    //

    service.getCountryList = function () {

        var query = $http({
            method: 'GET',
            url: '/api/company/getCountriesList'
        })
        .then( function ( response ) {

            var countries = response.data.countries;
            return countries;

        });

        return query;

    };

    service.getDepartmentList = function ( countryList ) {

        var query = $http({
            method: 'GET',
            url: '/api/company/getDepartmentsList',
            params: {
                countryList:    countryList.join('|')
            }
        })
        .then( function ( response ) {

            var departments = response.data.departments;
            return departments;

        });

        return query;

    };

    //

    return service;

}]);
