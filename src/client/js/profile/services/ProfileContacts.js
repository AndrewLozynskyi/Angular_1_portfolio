/*
 * @author ohmed
 * Profile contacts service
*/

angular.module( 'Profile.module' )

.service( 'profileContacts.service', [ '$http', '$rootScope', function ( $http, $rootScope ) {

    var service = {};

    //

    service.slideLeftMenu = {
        enable: false
    };

    //

    return service;

}]);
