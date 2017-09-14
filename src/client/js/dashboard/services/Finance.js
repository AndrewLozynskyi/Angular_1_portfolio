/*
 * @author ohmed
 * Dashboard Finance service
*/

angular.module( 'Dashboard.module' )

.service( 'finance.service', [ '$http', '$rootScope', function ( $http, $rootScope ) {

    var service = {};

    //

    // todo

    angular.element( document ).find('.dashboard-card').removeClass('add-shadow-position')
    angular.element( document ).find('#dashboard-card').removeClass('add-shadow').addClass('hide-shadow')
    angular.element( document ).find('.app-content').removeClass('add-shadow-scroll')

    $rootScope.showBackground = false;

    //

    return service;

}]);
