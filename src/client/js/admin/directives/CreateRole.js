/*
 * @author Illya
 * Admin create role popup directive
*/

angular.module( 'Admin.module' )

.directive( 'createRole', [ function () {

    return {
        restrict: 'E',
        controllerAs: 'cr',
        templateUrl: 'admin/directives/create-role.html',
        controller: [ '$scope', '$element', 'roles.service', 'users.service', 'groups.service', 'company.service', '$cookies', '$mdDialog', function ( $scope, $element, rolesService, usersService, groupsService, companyService, $cookies, $mdDialog ) {

            var $this = this;

            $scope.roleId = $element.attr('roleId');
            $this.action = $element.attr('action');
            $this.session = $cookies.get('session');

            $this.activeParams = { countries: [], departments: [] };
            $scope.activeParams = $this.activeParams;

            $this.getDepartments = rolesService.getD;
            $this.getCountries = rolesService.getC;

            rolesService.checkAllData();

            $scope.basedOn = 'hierarchy';

            //

            $scope.roleParams = {
                name:           '',
                description:    '',
                parentRoleId:   false
            };

            $scope.users = [];
            $scope.groups = [];

            $scope.roleUsers = [];
            $scope.roleGroups = [];
            $scope.newRole = true;
            $scope.assign = false;
            $scope.userScope = false;
            $scope.isHide = false;
            $scope.permissions = false;
            $scope.active = false;

            $scope.newModel = [];
            $scope.data = {};
            $scope.id = false;

            $scope.addUser = [];
            $scope.removeUser = [];

            $scope.addGroup = [];
            $scope.removeGroup = [];

            $scope.tempUsers = [];
            $scope.tempGroups = [];

            $scope.findUser = '';
            $scope.findAllUser = '';
            $scope.findGroup = '';
            $scope.findAllGroup = '';
            $scope.groupsActive = false;
            $scope.selectedTab = null;

            $scope.scope = {
                basedOn:                'hierarchy',
                countries:              [],
                departments:            [],
                selectedCountries:      [],
                selectedDepartments:    []
            };

            var delayTimer;

            $scope.$watch( 'scope', function ( value ) {

                companyService
                .getDepartmentList( value.selectedCountries )
                .then( function ( departments ) {

                    $scope.scope.departments = departments;

                });

            }, true );

            // Permissions params

            $scope.getDetailes = function ( roleId ) {

                // init scopes

                companyService
                .getCountryList()
                .then( function ( countries ) {

                    $scope.scope.countries = countries;

                });

                //

                rolesService.getDetailes( roleId )
                .then( function ( role ) {

                    if ( $this.action === 'edit' ) {

                        $scope.role = role;
                        $scope.roleParams = role;
                        $scope.scope.selectedCountries = role.scope.countries;
                        $scope.scope.selectedDepartments = role.scope.departments;
                        $scope.scope.basedOn = role.scope.basedOn;
                        console.log( $scope.scope );

                        $this.initCheckboxes();

                    }

                });

            };

            $scope.dataTableList = function () {

                rolesService.setDataTable()
                .then( function ( result ) {

                    $scope.dataTable = result;

                });

            };

            $scope.create = function () {

                if ( $this.action === 'edit' ) {

                    $scope.permissions = true;
                    $scope.newRole = false;

                    $scope.updateRole();

                } else {

                    rolesService.createRole( $scope.roleParams )
                    .then( function ( role ) {

                        $scope.id = role.roleId;
                        $scope.role = role.data.role;

                        if ( role.data.success ) {

                            $scope.permissions = true;
                            $scope.newRole = false;
                            $this.initCheckboxes()

                        } else if ( $scope.createUser.code === 1 || $scope.createUser.code === 0 ) {

                            return  $scope.createUser.message;

                        }

                    });

                }

            };

            $scope.updateRole = function () {

                rolesService.updateRole( $scope.role )
                .then( function () {

                    if ( $scope.role.parentRoleId === undefined ) {

                        $scope.role.parentRoleId = $scope.role.roleId;

                    }

                    $scope.getDetailes( $scope.role.parentRoleId );
                    rolesService.setDataTable();

                });

            };

            $scope.updatePermissions = function () {

                var id;
                var data = $scope.role;

                if ( $this.action === 'edit' ) {

                    $scope.initBasedOn();

                    id = $scope.roleId;
                    data.roleId = id;
                    $scope.role.parentRoleId = data.roleId;

                } else {

                    $scope.initBasedOn();

                    id = $scope.newRoleId;

                    if ( $scope.roleParams.parentRoleId === false ) {

                        $scope.roleParams.parentRoleId = $scope.role.roleId;
                        $scope.roleId = $scope.role.roleId;
                        $scope.role.parentRoleId = $scope.role.roleId;

                    } else {

                        $scope.roleId = $scope.roleParams.parentRoleId;
                        $scope.role.parentRoleId = $scope.roleId;

                    }

                }

                rolesService.updatePermissions( [ $scope.role ] )
                .then( function () {

                    $scope.permissions = false;
                    $scope.userScope = true;
                    rolesService.setDataTable();

                });

            };

            //  Toggle params

            $scope.updateScope = function () {

                var id;
                var data = $scope.role;

                if ( $this.action === 'edit' ) {

                    id = $scope.roleId;
                    data.roleId = id;

                } else {

                    id = $scope.newRoleId;

                }

                //

                $scope.role.scope.basedOn = $scope.scope.basedOn;
                $scope.role.scope.countries = $scope.scope.selectedCountries;
                $scope.role.scope.departments = $scope.scope.selectedDepartments;

                //

                rolesService.updateScope( [ $scope.role ] )
                .then( function () {

                    $scope.userScope = false;
                    $scope.assign = true;

                });

            };

            $this.toggleAll = function ( category ) {

                for ( var item in category ) {

                    if ( item === 'all' ) {

                        continue;

                    }

                    category[ item ] = ! category['all'];

                    category['moduleEnabled'] = true;

                }

            };

            $this.optionToggled = function ( category ) {

                var allChecked = true;

                for ( var item in category ) {

                    if ( item === 'all' ) {

                        continue;

                    }

                    if ( ! category[ item ] ) {

                        allChecked = false;

                        break;

                    }

                }

                category['all'] = allChecked;

            };

            $this.initCheckboxes = function () {

                checkIfAllChecked( $scope.role.permissions );

                function checkIfAllChecked ( category ) {

                    var allChecked = true;

                    for ( var item in category ) {

                        if ( item === 'all' ) continue;

                        if ( typeof category[ item ] === 'object' ) {

                            checkIfAllChecked( category[ item ] );

                        }

                        if ( ! category[ item ] && item !== 'moduleEnabled' ) {

                            allChecked = false;

                        }

                    }

                    category.all = allChecked;

                };

            };

            $scope.activateCheckboxes = function () {

                $scope.active = ! $scope.active;

            };

            $scope.isThisDisabled = function ( value ) {

                if ( value ) {

                    return false;

                }

                return true;

            };

            // Assign params

            $scope.assignUser = function () {

                $scope.userScope = false;
                $scope.assign = true;

            };

            $scope.addUsers = function ( user ) {

                var index = $scope.addUser.indexOf( user.uid );

                if ( index === -1 ) {

                    $scope.addUser.push( user.uid );

                } else {

                    $scope.addUser.splice( index, 1 );

                }

            };

            $scope.removeUsers = function ( user ) {

                var index = $scope.removeUser.indexOf( user.uid );

                if ( index === -1 ) {

                    $scope.removeUser.push( user.uid );

                } else {

                    $scope.removeUser.splice( index, 1 );

                }

            };

            $scope.addGroups = function ( group ) {

                var index = $scope.addGroup.indexOf( group.groupId );

                if ( index === -1 ) {

                    $scope.addGroup.push( group.groupId );

                } else {

                    $scope.addGroup.splice( index, 1 );

                }

            };

            $scope.removeGroups = function ( group ) {

                var index = $scope.removeGroup.indexOf( group.groupId );

                if ( index === -1 ) {

                    $scope.removeGroup.push( group.groupId );

                } else {

                    $scope.removeGroup.splice( index, 1 );

                }

            };

            $scope.hideGroup = function () {

                for ( var i = 0; i < $scope.groups.length; i ++ ) {

                    for ( var j = 0; j < $scope.addGroup.length; j ++ ) {

                        if ( $scope.addGroup[ j ] === $scope.groups[ i ].groupId ) {

                            delete $scope.groups[ i ].done;
                            $scope.roleGroups.push( $scope.groups[ i ] )

                        }

                    }

                }

                for ( var i = 0; i < $scope.roleGroups.length; i ++ ) {

                    _.remove( $scope.groups, { groupId: $scope.roleGroups[ i ].groupId } );

                }

                $scope.addGroup = [];

            };

            $scope.showGroup = function () {

                for ( var i = 0; i < $scope.roleGroups.length; i ++ ) {

                    for ( var j = 0; j < $scope.removeGroup.length; j ++ ) {

                        if ( $scope.removeGroup[ j ] === $scope.roleGroups[ i ].groupId ) {

                            delete $scope.roleGroups[ i ].done;
                            $scope.groups.push( $scope.roleGroups[ i ] )

                        }

                    }

                }

                for ( var i = 0; i < $scope.groups.length; i ++ ) {

                    _.remove( $scope.roleGroups, { groupId: $scope.groups[ i ].groupId } );

                }

                $scope.removeGroup = [];

            };

            $scope.hideUser = function () {

                for ( var i = 0; i < $scope.users.length; i ++ ) {

                    for ( var j = 0; j < $scope.addUser.length; j ++ ) {

                        if ( $scope.addUser[ j ] === $scope.users[ i ].uid ) {

                            delete $scope.users[ i ].done;
                            $scope.roleUsers.push( $scope.users[ i ] )

                        }

                    }

                }

                for ( var i = 0; i < $scope.roleUsers.length; i ++ ) {

                    _.remove( $scope.users, { uid: $scope.roleUsers[ i ].uid } );

                }

                $scope.addUser = [];

            };

            $scope.showUser = function () {

                for ( var i = 0; i < $scope.roleUsers.length; i ++ ) {

                    for ( var j = 0; j < $scope.removeUser.length; j ++ ) {

                        if ( $scope.removeUser[ j ] === $scope.roleUsers[ i ].uid ) {

                            delete $scope.roleUsers[ i ].done;
                            $scope.users.push( $scope.roleUsers[ i ] )

                        }

                    }

                }

                for ( var i = 0; i < $scope.users.length; i ++ ) {

                    _.remove( $scope.roleUsers, { uid: $scope.users[ i ].uid } );

                }

                $scope.removeUser = [];

            };

            $scope.saveChanges = function () {

                if ( $scope.roleId != $scope.basedId && $this.action === 'edit' ) {

                    for ( var i = 0; i < $scope.basedUsers.length; i ++ ) {

                        $scope.removeUser.push( $scope.basedUsers[ i ].uid );

                    }

                    for ( var i = 0; i < $scope.basedGroups.length; i ++ ) {

                        $scope.removeGroup.push( $scope.basedGroups[ i ].groupId );

                    }

                    usersService.removeRole( $scope.removeUser, $scope.roleId, $this.session )
                    .then( function () {

                        $scope.dataTableList();

                    });

                    groupsService.removeRole( $scope.removeGroup, $scope.roleId )
                    .then( function () {

                        $scope.dataTableList();

                    });

                    for ( var i = 0; i < $scope.roleUsers.length; i ++ ) {

                        $scope.addUser.push( $scope.roleUsers[ i ].uid );

                    }

                    for ( var i = 0; i < $scope.roleGroups.length; i ++ ) {

                        $scope.addGroup.push( $scope.roleGroups[ i ].groupId );

                    }

                    usersService.addRole( $scope.addUser, $scope.roleId, $this.session )
                    .then ( function () {

                        $scope.dataTableList();

                    });

                    groupsService.addRole( $scope.addGroup, $scope.roleId )
                    .then ( function () {

                        $scope.dataTableList();

                    });

                } else if ( $this.action !== 'edit' && $scope.createBasedId ) {

                    $scope.addUser.length = 0;
                    $scope.addGroup.length = 0;

                    for ( var i = 0; i < $scope.roleUsers.length; i ++ ) {

                        $scope.addUser.push( $scope.roleUsers[ i ].uid );

                    }

                    for ( var i = 0; i < $scope.roleGroups.length; i ++ ) {

                        $scope.addGroup.push( $scope.roleGroups[ i ].groupId );

                    }

                    usersService.addRole( $scope.addUser, $scope.role.roleId, $this.session )
                    .then( function () {

                        $scope.dataTableList();

                    });

                    groupsService.addRole( $scope.addGroup, $scope.role.roleId )
                    .then( function () {

                        $scope.dataTableList();

                    });

                } else {

                    for ( var i = 0; i < $scope.roleUsers.length; i ++ ) {

                        _.remove( $scope.tempUsers, { uid: $scope.roleUsers[ i ].uid } );

                    }

                    for ( var i = 0; i < $scope.roleGroups.length; i ++ ) {

                        _.remove( $scope.tempGroups, { groupId: $scope.roleGroups[ i ].groupId } );

                    }

                    for ( var i = 0; i < $scope.tempUsers.length; i ++ ) {

                        $scope.removeUser.push( $scope.tempUsers[ i ].uid );

                    }

                    for ( var i = 0; i < $scope.tempGroups.length; i ++ ) {

                        $scope.removeGroup.push( $scope.tempGroups[ i ].groupId );

                    }

                    usersService.removeRole( $scope.removeUser, $scope.role.roleId, $this.session )
                    .then( function () {

                        $scope.dataTableList();

                    });

                    groupsService.removeRole( $scope.removeGroup, $scope.role.roleId )
                    .then( function () {

                        $scope.dataTableList();

                    });

                    for ( var i = 0; i < $scope.addUser.length; i ++ ) {

                        _.remove( $scope.tempUsers, { uid: $scope.addUser[ i ] } );

                    }

                    for ( var i = 0; i < $scope.addGroup.length; i ++ ) {

                        _.remove( $scope.tempGroups, { groupId: $scope.addGroup[ i ] } );

                    }

                    for ( var i = 0; i < $scope.roleUsers.length; i ++ ) {

                        $scope.addUser.push( $scope.roleUsers[ i ].uid );

                    }

                    for ( var i = 0; i < $scope.roleGroups.length; i ++ ) {

                        $scope.addGroup.push( $scope.roleGroups[ i ].groupId );

                    }

                    usersService.addRole( $scope.addUser, $scope.role.roleId, $this.session )
                    .then( function () {

                        $scope.dataTableList();

                    });

                    groupsService.addRole( $scope.addGroup, $scope.role.roleId )
                    .then( function () {

                        $scope.dataTableList();

                    });

                }

            };

            $scope.activeUsers = function () {

                $scope.groupsActive = false;
                $scope.selectedTab = 0;

            };

            $scope.activeGroups = function () {

                $scope.groupsActive = true;
                $scope.selectedTab = ( $scope.selectedTab + 1 );

            };

            // Search params

            $scope.searchUser = function ( query ) {

                clearTimeout( delayTimer );

                delayTimer = setTimeout( function () {

                    if ( query ) {

                        $scope.querySearch = $scope.findAllUser;

                        usersService.getList( 0, 10000, false, false, $scope.querySearch )
                        .then( function ( data ) {

                            $scope.users = data.users;

                        });

                    } else {

                        $scope.querySearch = $scope.findUser;

                        rolesService.getUsers( $scope.roleId, $scope.querySearch )
                        .then( function ( users ) {

                            $scope.roleUsers = users;

                        });

                    }

                }, 700 );

            };

            $scope.searchGroup = function ( query ) {

                clearTimeout( delayTimer );

                delayTimer = setTimeout( function () {

                    if ( query ) {

                        $scope.querySearch = $scope.findAllGroup;

                        groupsService.getList( false, false, $scope.querySearch )
                        .then( function ( response ) {

                            $scope.groups = response.data.message;

                        });

                    } else {

                        $scope.querySearch = $scope.findAllGroup;

                        rolesService.getGroups( $scope.roleId, false, false, $scope.querySearch )
                        .then( function ( groups ) {

                            $scope.groups = groups;

                        });

                    }

                }, 700 );

            };

            // Init based on

            $scope.initBasedOn = function () {

                $scope.basedId = $scope.role.roleId;
                $scope.basedUsers = [];
                $scope.basedGroups = [];

                if ( $this.action !== 'edit' && $scope.roleParams.parentRoleId ) {

                    $scope.createBasedId = $scope.roleParams.parentRoleId;
                    $scope.initUsers( $scope.roleParams.parentRoleId );
                    $scope.initGroups( $scope.roleParams.parentRoleId );

                } else {

                    rolesService.getUsers( $scope.roleId, false )
                    .then( function ( users ) {

                        $scope.basedUsers = users;

                    });

                    rolesService.getGroups( $scope.roleId, false, false )
                    .then( function ( groups ) {

                        $scope.basedGroups = groups;

                    });

                    if (  $scope.roleId === $scope.role.roleId ) {

                        $scope.initGroups( $scope.roleId );
                        $scope.initUsers( $scope.roleId );

                    } else {

                        $scope.initGroups( $scope.role.roleId );
                        $scope.initUsers( $scope.role.roleId );

                    }

                }

            };

            // Init params

            $scope.cancel = function () {

                $mdDialog.cancel();

            };

            function capitalizeFirstLetter ( string ) {

                return string.charAt(0).toUpperCase() + string.slice(1);

            };

            if ( $this.action === 'edit' ) {

                $scope.getDetailes( $scope.roleId );

            }

            $scope.initUsers = function ( assignId ) {

                // Roles users

                rolesService.getUsers( assignId, false )
                .then( function ( users ) {

                    $scope.roleUsers = users;

                    if ( $this.action !== 'edit' && $scope.createBasedId ) {

                        $scope.addUser = $scope.roleUsers.slice();

                    }

                    for ( var i = 0; i < $scope.roleUsers.length; i ++ ) {

                        $scope.tempUsers.push( $scope.roleUsers[ i ] );

                    }

                    // All users

                    usersService.getList( 0, 10000, false, false, false )
                    .then( function ( users ) {

                        $scope.users = users.users;

                        for ( var i = 0; i < $scope.roleUsers.length; i ++ ) {

                            _.remove( $scope.users, { uid: $scope.roleUsers[ i ].uid } );

                        }

                    });

                });

            };

            $scope.initGroups = function ( assignId ) {

                // Role groups

                rolesService.getGroups( assignId, false, false )
                .then( function ( groups ) {

                    $scope.roleGroups = groups;

                    if ( $this.action !== 'edit' && $scope.createBasedId ) {

                        $scope.addGroup = $scope.roleGroups.slice();

                    }

                    for ( var i = 0; i < $scope.roleGroups.length; i ++ ) {

                        $scope.tempGroups.push( $scope.roleGroups[ i ] );

                    }

                    // All groups

                    groupsService.getList()
                    .then( function ( response ) {

                        $scope.groups = response.data.message;

                        for ( var i = 0; i < $scope.roleGroups.length; i ++  ) {

                            _.remove ( $scope.groups, { groupId: $scope.roleGroups[ i ].groupId } );

                        }

                    });

                });

            };

            $this.init = function () {

                $scope.dataTableList();

            };

            //

            $this.init();

        }]
    };

}]);
