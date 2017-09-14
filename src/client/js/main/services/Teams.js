/*
 * @author ohmed
 * Users service
*/

angular.module( 'hrTools' )

.service( 'teams.service', [ '$http', '$rootScope', function ( $http, $rootScope ) {

    var service = {};

    service.getList = function ( uid ) {

        var query = $http({
            method: 'GET',
            url: '/api/teams/getList',
            params: {
                uid:          uid,
                userId:       uid
            }
        }).then( function( res ) {

            angular.element( document )
                .find('.teams-card').removeClass('add-shadow-position')

            angular.element( document )
                .find('#teams-card').removeClass('add-shadow').addClass('hide-shadow')

            angular.element( document )
                .find('.app-content').removeClass('add-shadow-scroll')
        
            $rootScope.showBackground = false;

            return res;

        });

        return query;

    }

    service.getDetails = function ( uid, teamId, type ) {

        var query = $http({
            method: 'GET',
            url: '/api/teams/getDetails',
            params: {
                uid:          uid,
                teamId:       teamId,
                type:         type
            }
        })
        .then( function( res ) {

            angular.element( document )
                .find('.teams-card').removeClass('add-shadow-position')

            angular.element( document )
                .find('#teams-card').removeClass('add-shadow').addClass('hide-shadow')

            angular.element( document )
                .find('.app-content').removeClass('add-shadow-scroll')
        
            $rootScope.showBackground = false;
            
            return res;

        })

        return query;

    }

    service.getEmployees = function ( uid, teamId ) {

        var query = $http({
            method: 'GET',
            url: '/api/teams/getEmployees',
            params: {
                uid:          uid,
                teamId:       teamId
            }
        }).then( function( res ) {

            return res;

        });

        return query;

    }

    return service;

}]);