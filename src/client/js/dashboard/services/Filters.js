/*
 * @author ohmed
 * Dashboard Filters service
*/

angular.module( 'Dashboard.module' )

.service( 'filters.service', [ '$http', function ( $http ) {

    var service = {};

    //

    service.create = function ( title, callback ) {

        var data = { title: title };

        $http({
            method: 'POST',
            url: '/api/dashboard/filters/create',
            data: data
        }).then( function ( response ) {

            callback( response.data );

        });

    };

    service.remove = function ( filterId, callback ) {

        var data = { filterId: filterId };

        $http({
            method: 'GET',
            url: '/api/dashboard/filters/remove',
            params: data
        }).then( function ( response ) {

            callback();

        });

    };

    service.update = function ( filterId, params, callback ) {

        var data = { filterId: filterId };

        $http({
            method: 'POST',
            url: '/api/dashboard/filters/update',
            data: data
        }).then( function ( response ) {

            // todo

        });

    };

    service.getList = function ( callback ) {

        var data = {};

        $http({
            method: 'GET',
            url: '/api/dashboard/filters/getList',
            params: data
        }).then( function ( response ) {

            callback( response.data );

        });

    };

    //

    return service;

}]);
