/*
 * @author ohmed
 * Admin 'Home' tab controller
*/

angular.module( 'Admin.module' )

.service( 'admin.service', [ '$http', function ( $http ){

    var service = {};

    //

    service.getWidgetData = function ( callback ) {

        var query = $http({
            method: 'GET',
            url: '/api/admin/getGeneralData',
        })
        .then( function ( response ) {

            return callback( null, response.data );

        });

        return query;

    };

    return service;

}]);
