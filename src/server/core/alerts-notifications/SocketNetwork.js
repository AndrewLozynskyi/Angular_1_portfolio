/*
 * @author ohmed
 * Network for socket communication with clients
*/

var Auth = require('./../auth/Auth.js');
var Notifications = require('./Notifications.js');
var Alerts = require('./Alerts.js');

//

var SocketNetwork = function ( expressAPP ) {

    this.io = require('socket.io').listen( 3003 );
    this.users = {};

    //

    this.init();

};

SocketNetwork.prototype.init = function () {

    var scope = this;

    scope.io.on( 'connection', function ( socket ) {

        socket.on( 'Register', function ( message, callback ) {

            scope.registerUser( socket, message.uid, message.session, function ( data ) {

                callback( data );

            });

        });

        setTimeout( function () { socket.emit( 'Connected' ); }, 1000 );

    });

    //

    console.log('HR-tools: Socket network started.');

};

SocketNetwork.prototype.send = function ( uid, event, message ) {

    // todo

};

SocketNetwork.prototype.registerUser = function ( socket, uid, session, callback ) {

    var scope = this;

    //

    Auth.checkSesson( uid, session, function ( err, data ) {

        if ( err ) {

            return;

        }

        //

        scope.users[ data.user.uid ] = {
            info:           data.user,
            permissions:    data.permissions,
            socket:         socket
        };

        //

        Alerts.getList( uid, function ( err, alerts ) {

            Notifications.getList( uid, function ( err, notifications ) {

                return callback({ notifications: notifications, alerts: alerts });

            });

        });

    });

};

//

module.exports = SocketNetwork;
