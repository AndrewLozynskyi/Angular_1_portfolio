/*
 * @author ohmed
 * Users service
*/

angular.module( 'hrTools' )

.service( 'users.service', [ '$http', '$rootScope', function ( $http, $rootScope ) {

    var service = {};

    service.user = false;
    service.currentAvatar = { src: '' };

    //

    service.create = function ( params, callback ) {

        // todo

    };

    service.remove = function ( userId, callback ) {

        // todo

    };

    service.addRole = function ( usersList, roleId, session, callback ) {

        var query = $http({
            method: 'POST',
            url: '/api/users/addRole',
            data: {
                'roleId':           roleId,
                'usersList':        usersList,
                'session':          session
            }
        })
        .then( function ( response ) {

            return response;

        });

        return query;

    };

    service.removeRole = function ( usersList, roleId, session, callback ) {

        var query = $http({
            method: 'POST',
            url: '/api/users/removeRole',
            data: {
                'roleId':           roleId,
                'usersList':        usersList,
                'session':          session
            }
        })
        .then( function ( response ) {

            return response;

        });

        return query;

    };

    service.removeGroup = function ( gid, usersList, callback ) {

        var query = $http({
            method: 'POST',
            url: '/api/groups/removeUsers',
            data: {
                'gid':        gid,
                'usersList':  usersList
            }
        })
        .then( function ( response ) {

            return response;

        });

        return query;

    };

    service.isRoleEditPermissionsTokenValid = function ( uid, token, callback ) {

        $http({
            method: 'GET',
            url: '/api/users/isRolePermissionsUpdateTokenValid',
            params: {
                uid:    uid,
                token:  token
            }
        }).then( function ( response ) {

            callback( response.data.success == true );

        });

    };

    service.getRolePermissionsUpdateToken = function ( uid, password, callback ) {

        $http({
            method: 'GET',
            url: '/api/users/getRolePermissionsUpdateToken',
            params: {
                uid:        uid,
                password:   password
            }
        }).then( function ( response ) {

            callback( response.data.message );

        });

    };

    service.getGeneralUsersStatsInfo = function ( roleId, callback ) {

        $http({
            method: 'GET',
            url: '/api/users/getGeneralStatsInfo',
            params: {
                roleId: roleId
            }
        }).then( function ( response ) {

            callback( response.data.message );

        });

    };

    service.getList = function ( offset, size, roleId, groupId, querySearch, sortattr, sortdir, callback ) {

        var query = $http({
            method: 'GET',
            url: '/api/users/getList',
            params: {
                offset:     offset,
                size:       size,
                roleId:     roleId,
                groupId:    groupId,
                search:     querySearch || '',
                sortattr:     sortattr,
                sortdir:      sortdir
            }
        }).then( function ( response ) {

            if ( callback ) callback( response.data.message );
            return response.data.message;

        });

        return query;

    };

    service.changeActivationStatus = function ( uidList, status, callback ) {

        $http({
            method: 'POST',
            url: '/api/users/setActivationStatus',
            data: {
                usersList:     uidList,
                status:        status
            }
        }).then( function ( response ) {

            callback( response.data.success );

        });

    };

    service.changeStatus = function ( status, callback ) {

        $http({
            method: 'POST',
            url: '/api/users/setStatus',
            data: {
                status:        status
            }
        }).then( function ( response ) {

            $rootScope.userData.status = status;
            callback();

        });

    };

    service.setUserpic = function ( data, callback ) {

        $http({
            method: 'POST',
            url: '/api/users/setUserpic',
            data: {
                userpic:        data
            }
        }).then( function ( response ) {

            service.currentAvatar.src = '/usersData/' + response.data.uid + '/' + response.data.userpic;
            callback( response.data );

        });

    };

    service.removeUserpic = function ( callback ) {

        $http({
            method: 'POST',
            url: '/api/users/removeUserpic'
        }).then( function ( response ) {

            service.currentAvatar.src = '';
            callback({ userpic: '' });

        });

    };

    service.destroyUser = function () {

        service.user = false;

    };

    // Profile

    service.getUserInfo = function ( uid, username, callback ) {

        if ( ! username ) {

            username = service.user.username;

        }

        if ( service.user && service.user.uid === uid, service.user.username === username ) {

            callback( service.user );

        } else {

            $http({
                method: 'GET',
                url: '/api/users/profile/getInfo',
                params: {
                    userId:     uid,
                    username:   username
                }
            }).then( function ( response ) {

                service.user = response.data;

                if ( ! service.user.message.userpic ) {

                    service.currentAvatar.src = '';

                } else {

                    service.currentAvatar.src = service.user.message.userpic;

                }
                console.log(service.user );
                callback( service.user );

            });

        }

    };

    service.updateSocialLinks = function ( uid, session, newLinks ) {

        $http({
            method: 'POST',
            url: '/api/users/profile/updateSocialLinksInfo',
            data: {
                uid:        uid,
                session:    session,
                info:       newLinks
            }
        }).then( function ( response ) {

            console.log( response );

        });

    };

    service.updateContactsInfo = function ( uid, session, newContacts ) {

        $http({
            method: 'POST',
            url: '/api/users/profile/updateContactsInfo',
            data: {
                uid:        uid,
                session:    session,
                info:       newContacts
            }
        }).then( function ( response ) {

            // console.log( response );

        });

    };

    service.updateGeneralInfo = function ( uid, session, newGeneralInfo ) {

        $http({
            method: 'POST',
            url: '/api/users/profile/updateGeneralInfo',
            data: {
                uid:        uid,
                session:    session,
                info:       newGeneralInfo
            }
        }).then( function ( response ) {

            // console.log( response.data );

        });

    };

    service.updateJobExperiance = function ( uid, jobId, skillsList ) {

        var query = $http({
            method: 'POST',
            url: '/api/users/profile/updateJobSkills',
            data: {
                uid:        uid,
                jobId:      jobId,
                skillsList: skillsList
            }
        }).then( function ( response ) {

            return response;

        });

        return query;

    };

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

    service.getCurrentUser = function () {

        return service.user.message;

    };

    service.dropAvatar = function () {

        var query = $http({
            method: 'GET',
            url: '/api/users/profile/dropAvatar'
        })
        .then( function ( res ) {

            return res;

        })

        return query;

    };

    service.saveAddCourse = function ( uid, session, courseName, courseProvides, courseWebsite, ctrlMyDate ) {

        $http({
            method: 'POST',
            url: '/api/users/profile/addCourse',
            data: {
                uid:        uid,
                session:    session,
                course:     {
                    courseName: courseName,
                    courseProvides: courseProvides,
                    courseWebsite: courseWebsite,
                    ctrlMyDate: ctrlMyDate
                },
                userId:     uid
            }
        }).then( function ( response ) {

            if ( response.data.success === true ) {

                service.user.message.courses.push({
                    cerificatUrl:   '',
                    coursName:      courseName,
                    finished:       ctrlMyDate,
                    provider:       courseProvides,
                    webSite:        courseWebsite
                });

            }

        });

    };

    service.saveCourse = function ( uid, session, сourseArray ) {

        $http({
            method: 'POST',
            url: '/api/users/profile/saveCourse',
            data: {
                uid:         uid,
                session:     session,
                courseArray: сourseArray,
                userId:      uid
            }
        }).then( function ( response ) {

        });
    };

    service.removeCourse = function ( userId, courseId ) {

        $http({
            method: 'POST',
            url: '/api/users/profile/removeCourse',
            data: {
                userId:     userId,
                courseId:   courseId
            }
        }).then( function ( response ) {

        });

    };

    service.saveAddSocialNetwork = function ( uid, session, profileInSocialNetwork ) {

        $http({
            method: 'POST',
            url: '/api/users/profile/addSocialNetwork',
            data: {
                uid: uid,
                session: session,
                userId: uid,
                profileInSN: profileInSocialNetwork
            }
        }).then( function ( response ) {

        });

    };

    //

    return service;

}]);
