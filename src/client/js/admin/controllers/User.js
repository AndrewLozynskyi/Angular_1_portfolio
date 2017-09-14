/*
 * @author Illya, ohmed
 * Admin 'User' tab controller
*/

angular.module( 'Admin.module' )

.controller( 'user.controller', [ '$scope', '$rootScope', 'contacts.service', 'users.service', 'groups.service', '$mdDialog', 'profileContacts.service', function ( $scope, $rootScope, contactsService, usersService, groupsService, $mdDialog, contactsProfileService ) {

    var $this = this;
    $scope._ = _;

    $scope.employees = $this.employees;
    $scope.itemsPerPage = 20;
    $scope.isDisabled = true;
    $scope.disableAdd = true;
    $scope.disableRemove = true;
    $scope.removeStatus = true;
    $scope.newGroup = false;
    $this.groupName = '';

    $this.currentPage = 1;
    $this.itemsPerPage = 20;
    $this.maxPages = 1;
    $this.querySearch = false;

    $this.generalInfo = false;
    $this.users = [];
    $this.selectedUsers = [];
    $this.allUsersSelected = false;
    $this.selectedGroup = false;
    $this.editGroup = false;

    $this.selectedUsersUid = [];
    $this.findUser = '';
    $scope.newGroupName = '';
    $this.activeGroup = false;
    $this.sortQuery = '';

    $this.slideLeftMenu = contactsProfileService.slideLeftMenu;
    $this.showPopupMenu = contactsProfileService.slideLeftMenu;
    $rootScope.showSpinner = false;

    var delayTimer;

    $scope.pagination = {
        noOfPages: 1,
        currentPage: 0,
        pageSize: 20
    };

     angular.element( document )
        .find('.contacts-card')
        .addClass('add-contacts-shadow-position')

    angular.element( document )
        .find('#contacts-card')
        .addClass('add-contacts-shadow')
        .removeClass('hide-contacts-shadow')

    angular.element( document )
        .find('.app-content')
        .addClass('add-contacts-shadow-scroll')

    $rootScope.showBackground = true;

    //

    var addScroll =  function ( event ) {

        var appContent = $( document.querySelector( '.app-content' ) ).scrollTop();
        var x = angular.element( document ).find('#elem');
        var lastEl = x.children(':last');
        var offset = lastEl.offset();
        var top = offset.top;
        var bottom = $( window ).height() - top - lastEl.height();

        //

        if ( bottom >= 50 ) {

            $scope.loadingResult = false;

            setTimeout( function () {

                $scope.initializeResultList();

            }, 100 );

        }

    };

    document.querySelector( '.app-content' ).addEventListener( 'scroll',addScroll );

    $scope.loadMoreCourses = function ( groupId, groupName ) {

        if ( $scope.loadingResult ) {

            return;

        }

        if ( $scope.pagination.currentPage >= $scope.pagination.noOfPages ) {

            return;

        }

        if ( groupsService.currentGroupId === false ) {

            groupId = ( groupId === undefined ) ? false : groupId;

        } else {

            groupId = groupsService.currentGroupId

        }

        $this.selectedGroup = groupId;
        $this.groupName = groupName;

        usersService.getGeneralUsersStatsInfo( false, function ( info ) {

            $this.generalInfo = info;

            var tempGroup = [];

            for ( var i = 0; i < $this.generalInfo.groups.length; i ++ ) {

                tempGroup.push( $this.generalInfo.groups[ i ].groupId )

            }

            function isTrue ( element ) {

                return element === $this.selectedGroup;

            };

            if ( tempGroup.some( isTrue ) ) {

                $this.editGroup = true;

            } else {

                $this.editGroup = false;

            }

        });

        $scope.pagination.currentPage = $scope.pagination.currentPage + 1;
        $scope.offset = ( $scope.pagination.currentPage - 1 ) * $scope.pagination.pageSize;
        $scope.limit = $scope.pagination.pageSize;
        $scope.loadingResult = true;
        $this.searchQuery = usersService.currentQuery;
        $this.sortdir = !$this.sortdir;
        $this.findUser = '';

        //

        usersService
        .getList( $scope.offset, $scope.limit, false, $this.selectedGroup, false, $this.searchQuery, $this.sortdir )
        .then( function ( response ) {

            for ( var i = 0; i < response.users.length; i ++ ) {

                $this.users.push( response.users[ i ] )

            }

            $this.sortdir = ! $this.sortdir;

            $rootScope.showSpinner = true;

            if ( $this.users.length === $this.total ) {

                $rootScope.showSpinner = false;
                
            }

        });

    };

    $scope.initializeResultList = function () {

        usersService
        .getList( 0, 20, false, false, false, $this.sortdir )
        .then( function ( data ) {

            $scope.pagination.noOfPages = Math.ceil( data.total / $scope.pagination.pageSize );
            $scope.loadMoreCourses();

        });

    };

    $scope.rowselected = function ( row ) {

        $scope.rowNumber = row;

    };

    $scope.rowNumber = -1;
    
    $this.selectUsersFromGroup = function ( groupId, groupName ) {

        $this.selectedGroup = groupId;

        if ( groupId === false ) {

            groupsService.destroyGroupId();

            $scope.disableRemove = true;
            $scope.disableAdd = true;
            $this.allUsersSelected = false;
            $this.editGroup = false;
            $this.users.length = 0;

            $scope.pagination = {
                noOfPages: 1,
                currentPage: 0,
                pageSize: 20
            };

            $scope.loadingResult = false;
            $scope.loadMoreCourses( false, false );

            $this.selectedUsers = function ( selected ) {

                if ( selected ) {

                    $scope.disableAdd = false;

                } else {

                    $scope.disableAdd = true;

                }

            };

        } else {

            groupsService.setGroupId( $this.selectedGroup );

            $this.users.length = 0;
            $scope.pagination = {
                noOfPages: 1,
                currentPage: 0,
                pageSize: 20
            };

            $scope.loadingResult = false;
            $scope.disableAdd = true;
            $this.allUsersSelected = false;

            $scope.loadMoreCourses( $this.selectedGroup, groupName );

            $this.selectedUsers = function ( selected ) {

                if ( selected ) {

                    $scope.disableRemove = false;

                } else {

                    $scope.disableRemove = true;

                }

            };

        }

    };

    $scope.createGroup = function () {

        $scope.newGroup = true;

    };

    $this.addToGroup = function ( event ) {

        $mdDialog.show({
            parent: angular.element( document.body ),
            scope: $scope.$new(),
            template: '<md-dialog class="mobile-add" aria-label="contacts"><add-to-group users-list="getSelectedUsersList()"></add-to-group></md-dialog>',
            targetEvent: event,
            clickOutsideToClose: true
        }).finally( function () {

            usersService
            .getList( ( $this.currentPage - 1 ) * $this.itemsPerPage, $this.itemsPerPage, false, $this.selectedGroup, $this.querySearch )
            .then( function ( data ) {

                $scope.disableAdd = true;
                $this.users = data.users;
                $this.maxPages = Math.ceil( data.total / $this.itemsPerPage );
                $this.allUsersSelected = false;

                usersService.getGeneralUsersStatsInfo( false, function ( info ) {

                    $this.generalInfo = info;

                });

                if ( $this.users.length === 0 ) {

                    $this.allUsersSelected = false;

                }

            });

        });

    };

    $this.assignToRole = function ( event ) {

        $mdDialog.show({
            parent: angular.element( document.body ),
            scope: $scope.$new(),
            template: '<md-dialog class="mobile-add" aria-label="contacts"><assign-to-role users-list="getSelectedUsersList()"></assign-to-role></md-dialog>',
            targetEvent: event,
            clickOutsideToClose: true
        }).finally( function () {

            usersService
            .getList( ( $this.currentPage - 1 ) * $this.itemsPerPage, $this.itemsPerPage, false, $this.selectedGroup, $this.querySearch )
            .then( function ( data ) {

                $scope.disableAdd = true;
                $this.users = data.users;
                $this.maxPages = Math.ceil( data.total / $this.itemsPerPage );

                usersService.getGeneralUsersStatsInfo( false, function ( info ) {

                    $this.generalInfo = info;

                });

                if ( $this.users.length === 0 ) {

                    $this.allUsersSelected = false;

                }

            });

        });

    };

    $this.showUploadDialogue = function ( $event ) {

        $mdDialog.show({
            parent: angular.element( document.body ),
            targetEvent: $event,
            clickOutsideToClose: true,
            template: '<md-dialog class="uploadFiles" aria-label="Upload popup"><upload-popup url-to-pass="/api/company/importMainDataset" ></upload-popup></md-dialog>'
        });

    };

    $scope.createGroupName = function ( name ) {

        groupsService
        .create( name )
        .then( function () {

            usersService.getGeneralUsersStatsInfo( false, function ( info ) {

                $this.generalInfo = info;
                $scope.newGroupName = ' ';

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

    $this.removeGroup = function () {

        $scope.getSelectedUsersList();

        usersService
        .removeGroup( $this.selectedGroup, $this.selectedUsersUid, function ( data ) {

        })
        .then( function () {

            usersService
            .getList( ( $this.currentPage - 1 ) * $this.itemsPerPage, $this.itemsPerPage, false, $this.selectedGroup, $this.querySearch )
            .then( function ( data ) {

                $this.users = data.users;
                $this.maxPages = Math.ceil( data.total / $this.itemsPerPage );

                if ( $this.users.length === 0 ) {

                    $this.allUsersSelected = false;
                    $scope.disableRemove = true;

                }

            });

            usersService.getGeneralUsersStatsInfo( false, function ( info ) {

                $this.generalInfo = info;

            });

            $scope.disableRemove = true;

        })

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

    $this.toggleAllSelection = function () {

        for ( var i = 0, il = $this.users.length; i < il; i ++ ) {

            $this.users[ i ].selected = ! $this.allUsersSelected;

        }

        $this.selectedUsers( _.every( $this.users, [ 'selected', true ] ) );

    };

    $this.selectedUsers = function ( selected ) {

        if ( selected ) {

            $scope.disableAdd = false;

        } else {

            $scope.disableAdd = true;

        }

    };

    $this.removeUsers = function ( removed ) {

        if ( removed ) {

            $scope.removeStatus = false;

        } else {

            $scope.removeStatus = true;

        }

    };

    $this.sortItems = function ( query ) {

        $scope.pagination = {
            noOfPages: 1,
            currentPage: 0,
            pageSize: 20
        };

        $this.searchQuery = query;
        $scope.pagination.currentPage = $scope.pagination.currentPage + 1;
        $scope.offset = ( $scope.pagination.currentPage - 1 ) * $scope.pagination.pageSize;
        $scope.limit = $scope.pagination.pageSize;
        $scope.loadingResult = true;
        $this.users.length = 0;

        usersService.setCurrentQuery( $this.searchQuery );

        if ( $this.fieldName !== $this.searchQuery ) {

            $this.sortdir = true;

        }

        //

        usersService
        .getList( $scope.offset, $scope.limit, false, $this.selectedGroup, false, $this.searchQuery, $this.sortdir )
        .then( function ( response ) {

            for ( var i  = 0; i < response.users.length; i ++ ) {

                $this.users.push( response.users[ i ] )

            }

        });

        $this.sortdir = ! $this.sortdir;
        $this.fieldName = query;

    };

    $this.searchUser = function () {

        clearTimeout( delayTimer );

        delayTimer = setTimeout( function () {

            $this.querySearch = $this.findUser;

            usersService
            .getList( $scope.offset, $scope.limit, false, $this.selectedGroup, $this.querySearch, false, false )
            .then( function ( data ) {

                $this.users = data.users;
                $this.maxPages = Math.ceil( data.total / $this.itemsPerPage );

            });

        }, 700 );

    };

    $this.setItemsPerPage = function ( value ) {

        $this.itemsPerPage = value;

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

        usersService.changeActivationStatus( $this.usersList, $this.statusPerPage, function ( data ) {} );

    };

    $scope.cancel = function () {

        $scope.newGroup = false;

    };

    $scope.saveGroup = function ( group ) {

        $scope.createGroupName( group );
        $scope.newGroup = false;

    };

    //

    $scope.initializeResultList();

    $scope.$on('$destroy', function () {

        document.querySelector('.app-content').removeEventListener( 'scroll', addScroll );

    });

}]);
