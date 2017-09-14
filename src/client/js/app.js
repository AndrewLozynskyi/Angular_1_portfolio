/*
 * @author ohmed, markiyan, biven
 * HR-tool main
*/

angular.module( 'hrTools', [

    // angular modules

    'ngMaterial',
    'ngCookies',
    'ngFileUpload',
    'ngMessages',
    'ui.router',
    'ngLetterAvatar',
    'ngIntlTelInput',
    'toaster',
    'ngAnimate',

    // app modules

    'Dashboard.module',
    'Admin.module',
    'Contacts.module',
    'Profile.module',

    'templates'

])

.run( [ '$rootScope', '$state', '$window', 'alerts-notifications.service', function ( $rootScope, $state,  $window, alertsNotificationsService ) {

    // setup alerts-notifications network connection

    alertsNotificationsService.init();

    //

    $rootScope.$state = $state;
    $rootScope.userData = $window.userData;

    $rootScope.filtersEnabled = false;
    $rootScope.filtersList = false;

}]);

angular.module( 'templates', [] );
