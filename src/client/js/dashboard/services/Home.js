/*
 * @author ohmed, markiyan
 * Dashboard Headcount service
*/

angular.module( 'Dashboard.module' )

.service( 'home.service', [ '$http', '$rootScope', function ( $http, $rootScope ) {

    var service = {};
    // var generalInfo = {};


    service.getWidgetData = function () {

        var query = $http({
            method: 'GET',
            url: '/api/dashboard/home/getWidgetData'
        })
        .then( function ( response ) {

            return response

        });

        return query;

    };

    //

    return service;

}]);
