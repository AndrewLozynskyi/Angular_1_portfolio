/*
 * @author Illya, ohmed
 * Settings service
*/

angular.module( 'hrTools' )

.service( 'settings.service', [ '$http',  function ( $http ) {

    var service = {};

    //

    service.getParams = function () {

        var query = $http({
            method:     'GET',
            url:        '/api/users/settings/get'
        })
        .then( function ( response ) {

            return response;

        });

        return query;

    };

    service.setParams = function ( params ) {

        var query = $http({
            method:     'POST',
            url:        '/api/users/settings/set',
            data: {
                params:       params
            }
        })
        .then( function ( response ) {

            return response;

        });

        return query;

    };

    //

    return service;

}]);
