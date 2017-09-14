/*
 * @author Illya, ohmed
 * Groups service
*/

angular.module( 'hrTools' )

.service( 'groups.service', [ '$http', function ( $http ) {

    var service = {};

    service.currentGroupId = false;

    //

    service.getGroupId = function () {

        return service.currentGroupId;

    };

    service.setGroupId = function ( gid ) {

        service.currentGroupId = gid;

    };

    service.destroyGroupId = function () {

        service.currentGroupId = false;

    };

    service.create = function ( name ) {

        var query = $http({
            method: 'POST',
            url: '/api/groups/create',
            data: {
                name:   name
            }
        })
        .then( function ( response ) {

            return response;

        });

        return query;

    };

    service.remove = function () {

        // todo

    };

    service.getList = function ( offset, size, querySearch ) {

        var query = $http({
            method: 'GET',
            url: '/api/groups/getList',
            params: {
                offset:     offset,
                size:       size,
                search:     querySearch || ''
            }
        })
        .then( function ( response ) {

            return response;

        });

        return query;

    };

    service.addUsers = function ( gid, usersList ) {

        var query = $http({
            method: 'POST',
            url: '/api/groups/addUsers',
            data: {
                gid:        gid,
                usersList:  usersList
            }
        })
        .then( function ( response ) {

            return response;

        });

        return query;

    };

    service.addRole = function ( groupsList, roleId ) {

        if ( ! Array.isArray( groupsList ) ) {

            var groupsList = [ groupsList ];

        }

        var query = $http({
            method: 'POST',
            url: '/api/groups/addRole',
            data: {
                'roleId':       roleId,
                'groupsList':   groupsList
            }
        })
        .then( function ( response ) {

            return response;

        });

        return query;

    };

    service.removeRole = function ( groupsList, roleId ) {

        var query = $http({
            method: 'POST',
            url: '/api/groups/removeRole',
            data: {
                'roleId':       roleId,
                'groupsList':   groupsList
            }
        })
        .then( function ( response ) {

            return response;

        });

        return query;

    };

    //

    return service;

}]);
