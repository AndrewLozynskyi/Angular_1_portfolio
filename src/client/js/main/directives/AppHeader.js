/*
 * @author ohmed
 * Header directive
*/

angular.module( 'hrTools' )

.directive( 'appHeader', [ '$rootScope', 'users.service', function ( $rootScope, usersService ) {

    return {
        restrict: 'E',
        templateUrl: 'main/directives/header.html',
        link: function ( scope, element ) {

            scope.curUser = $rootScope.userData.username;

            $rootScope.$watch( 'userData', function () {

                if ( $rootScope.userData.userpic ) {

                    scope.userpic = '/usersData/' + $rootScope.userData.uid + '/' + $rootScope.userData.userpic;

                } else {

                    scope.userpic = '';

                }

            }, true );

            //

            scope.status = 'Online';

            //

            scope.getHeader = function () {

                if ( $rootScope.userData.firstName && $rootScope.userData.lastName ) {

                    return $rootScope.userData.firstName + ' ' + $rootScope.userData.lastName;

                } else if ( $rootScope.userData.firstName ) {

                    return $rootScope.userData.firstName;

                } else if ( $rootScope.userData.username ) {

                    return $rootScope.userData.username;

                } else {

                    return $rootScope.userData.email;

                }

            };

            var switchIcon = function () {

                switch ( $rootScope.userData.status ) {

                    case 'Online':

                        scope.statusIconSrs = '/img/icons/online-icon.png';
                        scope.status = 'Online';
                        break;

                    case 'Away':

                        scope.statusIconSrs = '/img/icons/notavaliable-icon.png';
                        scope.status = 'Away';
                        break;

                    case 'Do not Disturb':

                        scope.statusIconSrs = '/img/icons/not-disturb-icon.png';
                        scope.status = 'Do not Disturb';
                        break;

                    case 'Invisible':

                        scope.statusIconSrs = '/img/icons/offline-icon.png';
                        scope.status = 'Invisible';
                        break;

                    case 'Offline':

                        scope.statusIconSrs = '/img/icons/offline-icon.png';
                        scope.status = 'Offline';
                        break;

                }

            };

            scope.setStatus = function ( status ) {

                usersService.changeStatus( status, function () {

                    switchIcon();

                });

            };

            switchIcon();

        }
    };

}]);
