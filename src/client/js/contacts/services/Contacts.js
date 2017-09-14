/*
 * @author ohmed, illya
 * Users contacts service
*/

angular.module( 'Contacts.module' )

.service( 'contacts.service', [ '$rootScope', '$http', function ( $rootScope, $http ) {

    var service = {};

    service.currentQuery = false;

    //

    service.getCurrentQuery = function () {

        return service.currentQuery;

    };

    service.setCurrentQuery = function ( query ) {

        service.currentQuery = query;

    };

    service.destroyCurrentQuery = function () {

        service.currentQuery = false;

    };

    service.getCurrentType = function () {

        return service.currentType;

    };

    service.setCurrentType = function ( type ) {

        service.currentType = type;

    };

    service.destroyCurrentType = function () {

        service.currentType = false;

    };

    service.getCurrentGroup = function () {

        return service.currentGroup;

    };

    service.setCurrentGroup = function ( group ) {

        service.currentGroup = group;

    };

    service.destroyCurrentGroup = function () {

        service.currentGroup = false;

    };

    service.getContactsStats = function ( userId ) {

        var query =  $http({
            method: 'get',
            url:'/api/contacts/getGeneralStatsInfo',
            params: {
                userId: userId
            }
        }).then( function ( response ) {

            return response;

        });

        return query;

    };

    service.getContacts = function ( groupId, userId ) {

        var query =  $http({
            method: 'get',
            url:'/api/contacts/groups/getContactsList',
            params: {
                groupId: groupId,
                userId:  userId
            }
        }).then( function ( response ) {

           return response;

        });

        return query;

    };

    service.addUsers = function ( usersList ) {

        var query = $http({
            method: 'POST',
            url: '/api/contacts/add',
            data: {
                userList:       usersList
            }
        }).then( function ( response ) {

            return response;

        });

        return query;

    };

    service.removeUsers = function ( userList ) {

        var query = $http({
            method: 'POST',
            url: '/api/contacts/remove',
            data: {
                'userList':  userList
            }
        })
        .then( function ( response ) {

           return response;

        });

        return query;

    };

    service.followUsers = function ( usersList, callback ) {

        $http({
            method: 'POST',
            url: '/api/contacts/follow',
            data: {
                userList:       usersList
            }
        }).then( function ( response ) {

            callback( response );

        });

    };

    service.unfollowUsers = function ( usersList ) {

        var query = $http({
            method: 'POST',
            url: '/api/contacts/unfollow',
            data: {
                userList:       usersList
            }
        }).then( function ( response ) {

            return response;

        });

        return query;

    };

    service.getList = function ( userId, type, gid, search, offset, itemsPerPage, sortattr, sortdir ) {

        var query = $http({
            method: 'GET',
            url:'/api/contacts/getList',
            params: {
                'userId':       userId,
                'type':         type,
                'gid':          gid,
                'offset':       offset,
                'itemsPerPage': itemsPerPage,
                'search':       search || '',
                'sortattr':     sortattr,
                'sortdir':      sortdir

            }
        }).then( function ( response ) {

            angular.element( document )
                .find('.contacts-card').removeClass('add-contacts-shadow-position')

            angular.element( document )
                .find('#contacts-card').removeClass('add-contacts-shadow').addClass('hide-contacts-shadow')

            angular.element( document )
                .find('.app-content').removeClass('add-contacts-shadow-scroll')
        
            $rootScope.showSpinner = false;
            $rootScope.showBackground = false;
            

            return response;

        });

        return query;

    };

    service.getGroupContacts = function ( offset, itemsPerPage, search, userId, groupId, sortattr, sortdir ) {

        var query = $http({
            method: 'GET',
            url:'/api/contacts/groups/getContactsList',
            params: {
                groupId:      groupId,
                userId:       userId,
                offset:       offset,
                itemsPerPage: itemsPerPage,
                search:       search || '',
                sortattr:     sortattr,
                sortdir:      sortdir
            }
        }).then( function ( response ) {

            return response;

        });

        return query;

    };

    service.getAll = function ( offset, itemsPerPage, search, sortattr, sortdir ) {

        var query = $http({
            method: 'GET',
            url:'/api/contacts/getAll',
            params: {
                'offset':       offset,
                'itemsPerPage': itemsPerPage,
                'search':       search || '',
                'sortattr':     sortattr,
                'sortdir':      sortdir
            }
        }).then( function ( response ) {

            return response;

        });

        return query;

    };

    service.getFollowersList = function ( offset, itemsPerPage, userId, search, sortattr, sortdir ) {

        var query = $http({
            method: 'GET',
            url: '/api/contacts/getFollowersList',
            params: {
                offset:       offset,
                itemsPerPage: itemsPerPage,
                userId:       userId,
                search:       search,
                sortattr:     sortattr,
                sortdir:      sortdir
            }
        })
        .then( function ( response ) {

           return response;

        });

        return query;

    };

    service.getFollowingList = function ( offset, itemsPerPage, userId, search, sortattr, sortdir ) {

        var query = $http({
            method: 'GET',
            url: '/api/contacts/getFollowingList',
            params: {
                offset:       offset,
                itemsPerPage: itemsPerPage,
                userId:       userId,
                search:       search,
                sortattr:     sortattr,
                sortdir:      sortdir
            }
        })
        .then( function ( response ) {

           return response;

        });

        return query;

    };

    service.getRecent = function ( offset, itemsPerPage, search, userId, sortattr, sortdir ) {

        var query = $http({
            method: 'GET',
            url: '/api/contacts/getRecent',
            params: {
                offset:       offset,
                itemsPerPage: itemsPerPage,
                search:       search,
                userId:       userId,
                sortattr:     sortattr,
                sortdir:      sortdir
            }
        })
        .then( function ( response ) {

           return response;

        });

        return query;

    }

    // Contact groups

    service.createGroup = function ( name, callback ) {

        return $http({
            method: 'post',
            url: '/api/contacts/groups/create',
            data: {
                name:  name
            }
        }).then( function ( response ) {

            callback( null, response )

        }, function ( response ) {

            callback ( response, null )

        });

    };

    service.removeGroup = function ( groupId, callback ) {

        // todo

    };

    service.addContactsToGroup = function ( groupId, usersList, callback ) {

        var query = $http({
            method: 'POST',
            url: '/api/contacts/groups/addContacts',
            data: {
                groupId:    groupId,
                usersList:  usersList
            }
        })
        .then( function ( response ) {

           return response;

        });

        return query;

    };

    service.removeContactsFromGroup = function ( groupId, usersList, uid, callback ) {

        var query = $http({
            method: 'POST',
            url: '/api/contacts/groups/removeContacts',
            data: {
                groupId:    groupId,
                usersList:  usersList,
                uid:        uid
            }
        })
        .then( function ( response ) {

           return response;

        });

        return query;

    };

    service.getGroups = function ( userId, callback ) {

        // todo

    };

    //

    return service;

}]);
