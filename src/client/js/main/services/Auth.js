/*
 * @author ohmed, markiyan
 * Auth controller
*/

angular.module( 'hrTools' )

.service( 'auth.service', [ '$http', '$window', '$timeout', '$cookies', function ( $http, $window, $timeout, $cookies ) {

    var service = {};

    //

    service.ifUserExists = function ( username, callback ) {

        $http({
            method: 'GET',
            url: '/api/auth/ifUserExists',
            headers: {
                'Content-Type': 'application/json'
            },
            params: {
                username:   username
            }
        }).then( function ( response ) {

            callback( response.data );

        });

    };

    service.loginRequest = function ( data, cb ) {

        if ( ! data.email ) {

            localStorage.setItem( 'email', data.email );

        }

        $http({
            method: 'POST',
            url: '/api/auth/login',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        }).then( function ( response ) {

            if ( cb ) cb( response.data );

        }, function ( error ) {

            if ( cb ) cb( error );

        });

    };

    service.loginFB = function ( data, cb ) {

        $http({
            method: 'GET',
            url: '/api/auth/loginfb'
        }).then( function ( response ) {

            if ( cb ) cb( response.data );

        }, function ( error ) {

            if ( cb ) cb( error );

        });

    };

    service.loginLI = function ( data, cb ) {

        $http({
            method: 'GET',
            url: '/api/auth/loginli'
        }).then( function ( response ) {

            if ( cb ) cb( response.data );

        }, function ( error ) {

            if ( cb ) cb( error );

        });

    };

    service.loginGG = function ( data, cb ) {

        $http({
            method: 'GET',
            url: '/api/auth/logingg'
        }).then( function ( response ) {

            if ( cb ) cb( response.data );

        }, function ( error ) {

            if ( cb ) cb( error );

        });

    };

    service.logout = function ( callback ) {

        var data = {
            email:      localStorage.getItem('email'),
            session:    $cookies.get('session')
        };

        $http({
            method: 'GET',
            url: '/api/auth/logout',
            params: data
        }).then( function ( response ) {

            if ( callback ) callback();

        }, function ( error ) {

            if ( callback ) callback();

        });

    };

    //

    return service;

}]);
