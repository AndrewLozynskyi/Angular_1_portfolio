/*
 * @author ohmed
 * Notification service
*/

angular.module( 'hrTools' )

.service( 'alerts-notifications.service', [ '$cookies', function ( $cookies ) {

    var service = {};
    var socket;

    var uid = $cookies.get('uid');
    var session = $cookies.get('session');

    //

    service.send = function () {

        // todo

    };

    service.init = function () {

        socket = io( 'http://' + window.location.hostname + ':3003' );

        socket.on( 'Connected', function () {
        
            socket.emit( 'Register', { uid: uid, session: session }, function ( response ) {

                console.log( response );

            });

        });

    };

    //

    return service;

}]);
