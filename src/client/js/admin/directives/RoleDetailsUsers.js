/*
 * @author ohmed
 * Admin: Role Detailes page [users tab] directive
*/

angular.module( 'Admin.module' )

.directive( 'roleDetailsUsers', [ function () {

    return {
        restrict: 'E',
        scope: {
            roleData: '='
        },
        controllerAs: 'rdu',
        templateUrl: 'admin/directives/role-details-users.html',
        controller: [ '$rootScope', '$scope', '$timeout', 'roles.service', 'users.service', '$mdDialog', function ( $rootScope, $scope, $timeout, rolesService, usersService, $mdDialog ) {

            var $this = this;

            $this.role = false;

            $this.usersPerPage = 10;
            $this.totalPagesCount = 0;
            $this.currentPage = 1;

            $scope.isDisabled = true;
            $this.generalInfo = false;
            $this.allUsersSelected = false;
            $this.selectedUsersUid = [];

            $this.users = [];
            $this.itemsPerPage = 10;
            $this.groupMaxPage = 0;
            $this.currentPage = 1;

            $this.findUser = '';
            $this.querySearch = false;
            var delayTimer;

            $scope.pagination = {
                noOfPages: 1,
                currentPage: 0,
                pageSize: 10
            };

            $this.users = [];

            //

            var addScroll =  function ( event ) {

                var appContent = $( document.querySelector( '.app-content' ) ).scrollTop();
                var x = angular.element( document ).find('#elem-users');

                var lastEl = x.children(':last');

                var offset = lastEl.offset();
                var top = offset.top;
                var bottom = $( window ).height() - top - lastEl.height();

                if ( bottom >= 95 ) {

                    $scope.loadingResult = false;

                    setTimeout( function () {

                        $scope.initializeResultList();

                    }, 100 );

                }

            };

            $this.loadMoreCourses = function () {

                if ( $scope.loadingResult ) {

                    return;

                }

                if ( $scope.pagination.currentPage >= $scope.pagination.noOfPages ) {

                    return;

                }

                $scope.pagination.currentPage = $scope.pagination.currentPage + 1;
                $scope.offset = ( ( $scope.pagination.currentPage - 1 ) * $scope.pagination.pageSize );
                $scope.limit = $scope.pagination.pageSize;
                $scope.loadingResult = true;
                $this.searchQuery = usersService.currentQuery;
                $this.sortdir = !$this.sortdir;
                $this.findUser = '';

                usersService
                .getList( $scope.offset, $scope.limit, $this.role.roleId, false, false, false, $this.sortdir )
                .then( function ( result ) {

                    for ( var i  = 0; i < result.users.length; i ++ ) {

                        $this.users.push( result.users[ i ] )

                    }

                    $this.sortdir = ! $this.sortdir;

                    document.querySelector( '.app-content' ).addEventListener( 'scroll', addScroll );

                });

            };

            $scope.initializeResultList = function () {

                usersService.getList( 0, 10, $this.role.roleId, false, false, false, $this.sortdir, function ( result ) {

                    $scope.pagination.noOfPages = Math.ceil( result.total / $scope.pagination.pageSize );
                    $this.loadMoreCourses();

                });

            };

            $this.searchUser = function () {

                clearTimeout( delayTimer );

                delayTimer = setTimeout( function () {

                    $this.querySearch = $this.findUser;

                    usersService
                    .getList( ( $this.currentPage - 1 ) * $this.itemsPerPage, $this.itemsPerPage, $this.role.roleId, false,  $this.querySearch, $this.sortdir, false )
                    .then( function ( data ) {

                        $this.users = data.users;
                        $this.maxPages = Math.ceil( data.total / $this.itemsPerPage );

                    });

                }, 700 );

            };

            $this.sortItems = function ( query ) {

                $this.sortQuery = query;

                $scope.pagination = {
                    noOfPages: 1,
                    currentPage: 0,
                    pageSize: 20
                };

                $this.searchQuery = query;
                $scope.pagination.currentPage = $scope.pagination.currentPage + 1;
                $scope.offset = ( ( $scope.pagination.currentPage - 1 ) * $scope.pagination.pageSize );
                $scope.limit = $scope.pagination.pageSize;
                $scope.loadingResult = true;

                $this.users.length = 0;
                usersService.setCurrentQuery( $this.searchQuery );

                if ( $this.fieldName !== $this.searchQuery ) {

                    $this.sortdir = true;

                }

                usersService
                .getList ( $scope.offset, $scope.limit, $this.role.roleId, false, false, $this.searchQuery, $this.sortdir )
                .then( function( response ) {

                    for ( var i  = 0; i < response.users.length; i ++ ) {

                        $this.users.push( response.users[ i ] )

                    }

                });

                $this.sortdir = ! $this.sortdir;
                $this.fieldName = query;

            };

            $this.setItemsPerPage = function ( value ) {

                $this.usersPerPage = value;

            };

            $this.setStatusPerPage = function ( value ) {

                $this.statusPerPage = value;

            };

            $this.selectedUsers = function ( selected ) {

                if ( selected ) {

                    $scope.isDisabled = false;

                } else {

                    $scope.isDisabled = true;

                }

            };

            $this.toggleAllSelection = function () {

                for ( var i = 0, il = $this.users.length; i < il; i ++ ) {

                    $this.users[ i ].selected = ! $this.allUsersSelected;

                }

                $this.selectedUsers( _.every($this.users, [ 'selected', true ] ) );

            };

            $this.toggleUserSelection = function ( employeeID ) {

                var allUsersSelected = true;

                for ( var i = 0, il = $this.users.length; i < il; i ++ ) {

                    if ( ! $this.users[ i ].selected ) {

                        allUsersSelected = false;

                    }

                }

                $this.selectedUsers( _.some( $this.users, [ 'selected', true ] ) );
                $this.allUsersSelected = allUsersSelected;

            };

            $this.addToGroup = function ( event ) {

                $mdDialog.show({
                    parent: angular.element( document.body ),
                    scope: $scope.$new(),
                    template: '<md-dialog class="mobile-add" aria-label="contacts"><add-to-group users-list="getSelectedUsersList()"></add-to-group></md-dialog>',
                    targetEvent: event,
                    clickOutsideToClose: true
                }).finally( function () {

                    rolesService
                    .getGroups( $this.role.roleId, ( $this.currentPage - 1 ) * $this.itemsPerPage, $this.itemsPerPage )
                    .then( function ( groups ) {

                        $this.groupMaxPage = Math.ceil( groups.length / $this.itemsPerPage );
                        $this.groups = groups;
                        $scope.$emit( 'groups', $this.groups );

                    });

                    rolesService
                    .getDetailes( $this.role.roleId )
                    .then( function ( role ) {

                        $this.role = role;

                    });

                    $this.allUsersSelected = false;

                    $scope.pagination = {
                        noOfPages: 1,
                        currentPage: 0,
                        pageSize: 20
                    };

                    $scope.pagination.currentPage = $scope.pagination.currentPage + 1;
                    $scope.offset = ( ( $scope.pagination.currentPage - 1 ) * $scope.pagination.pageSize );
                    $scope.limit = $scope.pagination.pageSize;
                    $scope.loadingResult = true;

                    usersService.getList( $scope.offset, $scope.limit, $this.role.roleId, false, false, false, $this.sortdir )
                    .then( function ( result ) {

                        $this.users = result.users;
                        $this.sortdir = ! $this.sortdir;

                        document.querySelector( '.app-content' ).addEventListener( 'scroll', addScroll );

                    });

                })

            };

            $this.assignToRole = function ( event ) {

                $mdDialog.show({
                    parent: angular.element( document.body ),
                    scope: $scope.$new(),
                    template: '<md-dialog class="mobile-add" aria-label="contacts"><assign-to-role users-list="getSelectedUsersList()"></assign-to-role></md-dialog>',
                    targetEvent: event,
                    clickOutsideToClose: true
                }).finally( function () {

                    $this.allUsersSelected = false;

                    $scope.pagination = {
                        noOfPages: 1,
                        currentPage: 0,
                        pageSize: 20
                    };

                    $scope.pagination.currentPage = $scope.pagination.currentPage + 1;
                    $scope.offset = ( ( $scope.pagination.currentPage - 1 ) * $scope.pagination.pageSize );
                    $scope.limit = $scope.pagination.pageSize;
                    $scope.loadingResult = true;

                    usersService.getList( $scope.offset, $scope.limit, $this.role.roleId, false, false, false, $this.sortdir )
                    .then( function ( result ) {

                        $this.users = result.users;
                        $this.sortdir = ! $this.sortdir;

                        document.querySelector( '.app-content' ).addEventListener( 'scroll', addScroll );

                    });

                });

            };

            $this.remove = function ( uid ) {

                $scope.getSelectedUsersList();

                if ( $this.selectedUsersUid.length === 0 ) {

                    $this.selectedUsersUid.push( uid );

                }

                usersService.removeRole( $this.selectedUsersUid, $this.role.roleId )
                .then( function ( data ) {

                    rolesService.getDetailes( $this.role.roleId )
                    .then( function ( role ) {

                        $scope.pagination = {
                            noOfPages: 1,
                            currentPage: 0,
                            pageSize: 20
                        };

                        $scope.pagination.currentPage = $scope.pagination.currentPage + 1;
                        $scope.offset = ( ( $scope.pagination.currentPage - 1 ) * $scope.pagination.pageSize );
                        $scope.limit = $scope.pagination.pageSize;
                        $scope.loadingResult = true;

                        usersService.getList( $scope.offset, $scope.limit, $this.role.roleId, false, false, false, $this.sortdir )
                        .then( function ( result ) {

                            $this.users = result.users;
                            $this.sortdir = ! $this.sortdir;

                            document.querySelector( '.app-content' ).addEventListener( 'scroll', addScroll );

                        });

                    });

                });

            };

            $scope.getSelectedUsersList = function () {

                $this.selectedUsersUid.length = 0;

                for ( var i = 0, il = $this.users.length; i < il; i ++ ) {

                    if ( $this.users[ i ].selected ) {

                        $this.selectedUsersUid.push( $this.users[ i ].uid );

                    }

                }

                return $this.selectedUsersUid;

            };

            $this.setStatusPerPage = function ( value ) {

                $this.usersList = [];

                $this.statusPerPage = value;

                for ( var i = 0; i < $this.users.length; i ++ ) {

                    if ( $this.users[ i ].selected ) {

                        $this.users[ i ].status = value;
                        $this.usersList.push( $this.users[ i ].uid );

                    }

                }

                usersService.changeActivationStatus( $this.usersList, $this.statusPerPage, function ( data ) {

                    $this.selectedUsersUid.length = 0;

                });

            };

            //

            function init ( data ) {

                $this.role = data;
                $scope.initializeResultList()

            };

            $scope.$on( 'roleData', function ( event, data ) {

                if ( ! data ) return;
                init( data );

            });

            $rootScope.$on('back', function ( event, data ) {

                $this.back = data;

                if ( $this.back ) {

                    $this.users.length = 0;
                    $scope.loadingResult = false;

                    $scope.pagination = {
                        noOfPages: 1,
                        currentPage: 0,
                        pageSize: 10
                    };

                    document.querySelector('.app-content').removeEventListener( 'scroll', addScroll );

                };

            });

        }]
    };

}]);
