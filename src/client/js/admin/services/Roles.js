/*
 * @author Illya, ohmed
 * Admin roles service
*/

angular.module( 'Admin.module' )

.service( 'roles.service', [ '$http', 'users.service', function ( $http, usersService ) {

    var dataTable = [];
    var service = {};
    var countries = [];
    var departments = [];
    var property;
    var dataTable = [];

    //

    service.createRole = function ( params ) {

        var query = $http({
            method: 'POST',
            url: '/api/roles/create',
            data: {
                'name':             params.name,
                'description':      params.description,
                'parentRoleId':     + params.parentRoleId
            }
        })
        .then( function ( response ) {

            return response;

        });

        return query;

    };

    service.delete = function ( roleId ) {

        var query = $http({
            method: 'GET',
            url: '/api/roles/remove',
            params: {
                'roleId': roleId
            }
        })
        .then( function ( response ) {

            return response;

        });

        return query;

    };

    service.updateRole = function ( roleData ) {

        var query = $http({
            method: 'POST',
            url: '/api/roles/updateGeneral',
            data: {
                'roleId':       roleData.roleId,
                'name':         roleData.name,
                'description':  roleData.description
            }
        })
        .then( function ( response ) {

            return response;

        });

        return query;

    };

    service.updatePermissions = function ( roles ) {

        var query = $http({
            method: 'POST',
            url: '/api/roles/updatePermissions',
            data: {
                roles: roles
            }
        })
        .then( function ( response ) {

            return response;

        });

        return query;

    };

    service.updateScope = function ( roles ) {

        var query = $http({
            method: 'POST',
            url: '/api/roles/updateScope',
            data: {
                roles: roles
            }
        })
        .then( function ( response ) {

            return response;

        });

        return query;

    };

    service.addUsers = function ( usersList, roleId, session ) {

        var query = $http({
            method: 'POST',
            url: '/api/users/addRole',
            data: {
                roleId:     roleId,
                usersList:  usersList,
                session:    session
            }
        })
        .then( function ( response ) {

            return response;

        });

        return query;

    };

    service.getDetailes = function ( roleId ) {

        var query = $http({
            method: 'GET',
            url: '/api/roles/getDetailes',
            params: {
                roleId: roleId
            }
        })
        .then( function ( response ) {

            var data = response.data;
            return data;

        });

        return query;

    };

    service.getList = function () {

        var query = $http({
            method: 'GET',
            url: '/api/roles/getList'
        })
        .then( function ( response ) {

            var data = response.data;
            return data;

        });

        return query;

    };

    service.getUsers = function ( roleId, querySearch ) {

        var query = $http({
            method: 'GET',
            url: '/api/roles/getUsers',
            params: {
                roleId: roleId,
                search:     querySearch || ''
            }

        })
        .then( function ( response ) {

            var data = response.data.message;
            return data;

        });

        return query;

    };

    service.getGroups = function ( roleId, offset, size, querySearch ) {

        var query = $http({
            method: 'GET',
            url: '/api/roles/getGroups',
            params: {
                roleId:     roleId,
                offset:     offset,
                size:       size,
                search:     querySearch || ''
            }
        })
        .then( function ( response ) {

            return response.data.message.groups;

        });

        return query;

    };

    service.setDataTable = function () {

        var query = $http({
            method: 'GET',
            url: '/api/roles/getList'
        })
        .then( function ( response ) {

            dataTable = response.data;
            return dataTable;

        });

        return query;

    };

    service.getDataTable = function () {

        return dataTable;

    };

    service.getDepartments = function () {

        var query = $http({
            method: 'GET',
            url: '/api/roles/getScopeDepartmentsList'
        }).then( function ( response ) {

            var departmentsList = response.data.departments;
            departments = angular.copy( departmentsList );

        });

        return query;

    };

    service.getCountries = function () {

        var query = $http({
            method: 'GET',
            url: '/api/roles/getScopeCountriesList'
        }).then( function ( response ) {

            var countriesList = response.data.countries;
            countries = angular.copy( countriesList );

        });

        return query;

    };

    service.getD = function () {

        return departments;

    };

    service.getC = function () {

        return countries;

    };

    service.checkAllData = function () {

        service.getCountries();
        service.getDepartments();

    };

    //

    return service;

}]);
