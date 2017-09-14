/*
 * @author ohmed, oleg
 * Contacts controller
 */

angular.module( 'Contacts.module' )

.controller( 'contacts.controller', [ '$scope', '$rootScope', 'contacts.service', 'users.service', '$mdDialog', '$cookies', '$timeout', 'profileContacts.service', function ( $scope, $rootScope, contactsService, usersService, $mdDialog, $cookies, $timeout, contactsProfileService ) {

    var $this = this;

    $scope._ = _;

    $this.showAddLink = true;
    $this.showAddGroupInput = false;
    $this.disableAdd = true;
    $this.disableRemove = true;
    $this.disableGrRemove = true;
    $this.selectedGroup = false;
    $this.selectedContacts = false;
    $this.allContacts = true;

    $this.contactsStats = {};
    $this.contacts = [];
    $this.selectedUsers = [];
    $this.selectedUsersUid = [];

    $this.layout = 'list';
    $this.newGroupName ='';
    $this.findUser = '';

    $this.maxPages = 1;
    $this.currentPage = 1;
    $this.itemsPerPage = 20;
    $this.slideLeftMenu = contactsProfileService.slideLeftMenu;
    $this.showPopupMenu = contactsProfileService.slideLeftMenu;
    $this.showSpinner = false;


    var userId = ( usersService.getCurrentUser() ) ? usersService.getCurrentUser().uid : $cookies.get('uid');
    var delayTimer;

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

    $this.showBackground = true;

    //

    // Contacts Scroll

    var addScroll =  function ( event ) {

        var appContent = $( document.querySelector( '.app-content' ) ).scrollTop();

        var x = angular.element( document ).find('#elem');
        var lastEl = x.children(':last');

        if ( lastEl.offset() === undefined ) return;

        var offset = lastEl.offset();
        var top = offset.top;
        var bottom = $( window ).height() - top - lastEl.height();

        if ( bottom >= 50 ) {

            $scope.loadingResult = false;

            setTimeout(function () {

                $scope.initializeResultList();

            }, 100 )

        }

    };

    $scope.pagination = {
        noOfPages: 1,
        currentPage: 0,
        pageSize: 20
    };

    $this.contacts = [];

    $scope.loadMoreCourses = function ( type, groupId ) {

        $this.type = contactsService.currentType;
        $this.group = contactsService.currentGroup;
        $this.sortattr = contactsService.currentQuery;

        if ( $this.type === undefined || $this.type === false ) {

            $this.type = 'all'

        }

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
        contactsService.getList( userId, $this.type, $this.group, $this.querySearch, $scope.offset, $scope.limit, $this.sortattr, $this.sortdir )
        .then( function ( response ) {

            if ( response.data.code === 0 ) {

                return;

            }

            for ( var i  = 0; i < response.data.message.contacts.length; i ++ ) {

                $this.contacts.push( response.data.message.contacts[ i ] );

            }

            for ( var i  = 0; i < $this.contacts.length; i ++ ) {

                $this.contacts[ i ].fullName = $this.contacts[ i ].firstName + ' ' + $this.contacts[ i ].lastName; 

            }

            $this.total = response.data.message.total;

            document.querySelector( '.app-content' ).addEventListener( 'scroll', addScroll );
            
            $this.showBackground = false;

            if ( $this.contacts.length >= 20 && $this.contacts.length < $this.total) {

                $this.showSpinner = true;
                
            }

            if ( $this.contacts.length === $this.total ) {

                $this.showSpinner = false;

                return;

            }

        })

    };

    $scope.initializeResultList = function () {

        if ( $this.contacts.length === 0 ) {

            contactsService.getList( userId, 'all', false, false, 0, 20, $this.sortattr, $this.sortdir )
            .then( function ( data ) {

                $this.total = 0;
                
                $scope.pagination.noOfPages = Math.ceil( data.data.total / $scope.pagination.pageSize );

            });
            

        }

        if ( $this.contacts.length === $this.total ) {

            return;

        }

        $scope.loadMoreCourses();

    };

    $scope.initializeResultList();

    //

    $this.disableButtons = function () {

        $this.allUsersSelected = false;
        $this.disableAdd = true;
        $this.disableRemove = true;
        $this.disableGrRemove = true;

    };

    $this.getContactStats = function () {

        contactsService.getContactsStats( userId )
        .then( function ( response ) {

            $this.contactsStats = response.data.message.message;

        });

    };

    $this.setItemsPerPage = function ( value ) {

        $this.itemsPerPage = value;

    };

    $this.sortItems = function ( query ) {

        $scope.pagination = {
            noOfPages: 1,
            currentPage: 0,
            pageSize: 20
        };

        $this.searchQuery = query;
        $scope.loadingResult = false;
        $this.contacts.length = 0;
        contactsService.setCurrentQuery( $this.searchQuery );

        if ( $this.fieldName !== $this.searchQuery ) {

            $this.sortdir = true;

        }

        $this.sortdir = ! $this.sortdir;
        $this.fieldName = query;
        $this.disableButtons();
        $scope.loadMoreCourses();

    };

    $this.searchUser = function () {

        $scope.pagination = {
            noOfPages: 1,
            currentPage: 0,
            pageSize: 20
        };

        $scope.loadingResult = false;

        clearTimeout( delayTimer );

        delayTimer = setTimeout( function () {

            $this.contacts.length = 0;
            $this.querySearch = $this.findUser;
            $scope.loadMoreCourses();

        }, 700 );

    };

    // Contacts

    $this.addToContacts = function ( uid ) {

        if ( uid === undefined ) {

            $scope.getSelectedUsersList();

            if ( $this.selectedUsersUid.length === 0 ) {

                $this.selectedUsersUid.push( uid );

            }

            uid = $this.selectedUsersUid;

        }

        contactsService.addUsers( uid )
        .then( function ( response ) {

            $scope.loadingResult = false;
            $this.contacts.length = 0;
            $scope.pagination = {
                noOfPages: 1,
                currentPage: 0,
                pageSize: 20
            };

            $this.disableButtons();
            $scope.initializeResultList();
            $this.getContactStats();

        });

    };

    $this.removeUser = function ( uid ) {

        $scope.getSelectedUsersList();

        if ( $this.selectedUsersUid.length === 0 ) {

            $this.selectedUsersUid.push( uid );

        }

        //

        contactsService.removeUsers( $this.selectedUsersUid, function ( data ) {

            $this.disableRemove = true;

        })
        .then( function ( response ) {

            contactsService.getList( ( $this.currentPage -  1 ) * $this.itemsPerPage, $this.itemsPerPage, false, userId )
            .then( function ( response ) {

                $this.allUsersSelected = false;
                $scope.loadingResult = false;
                $this.contacts.length = 0;
                $scope.pagination = {
                    noOfPages: 1,
                    currentPage: 0,
                    pageSize: 20
                };

                $this.disableButtons();
                $scope.initializeResultList();
                $this.getContactStats();
                $this.selectedUsers();

            });

        });

    };

    $this.unfollow = function ( uid ) {

        contactsService.unfollowUsers( [ uid ] )
        .then( function ( response ) {

            $this.getContactStats();

            $scope.loadingResult = false;
            $this.contacts.length = 0;
            $scope.pagination = {
                noOfPages: 1,
                currentPage: 0,
                pageSize: 20
            };

            $scope.initializeResultList();

        });

    };

    // Contacts groups

    $this.addContactsToGroup = function ( event ) {

        $mdDialog.show({
            parent: angular.element( document.body ),
            scope: $scope.$new(),
            template: '<md-dialog class="mobile-add" aria-label="contacts"><add-contacts-to-group contacts-list="getSelectedUsersList()"></add-contacts-to-group></md-dialog>',
            targetEvent: event,
            clickOutsideToClose: true
        }).finally( function () {

            $this.allUsersSelected = false;
            $scope.loadingResult = false;
            $this.contacts.length = 0;
            $scope.pagination = {
                noOfPages: 1,
                currentPage: 0,
                pageSize: 20
            };

            $this.disableButtons();
            $scope.initializeResultList();
            $this.getContactStats();
            $this.selectedUsers();

        });

    };

    $this.removeFromGroup = function ( uid ) {

        $scope.getSelectedUsersList();

        groupId = $this.selectedGroup;

        if ( $this.selectedUsersUid.length === 0 ) {

            $this.selectedUsersUid.push( uid );

        }

        //

        contactsService.removeContactsFromGroup( groupId, $this.selectedUsersUid, userId )
        .then( function ( response ) {

            $this.allUsersSelected = false;
            $scope.loadingResult = false;
            $this.contacts.length = 0;
            $scope.pagination = {
                noOfPages: 1,
                currentPage: 0,
                pageSize: 20
            };

            $this.disableButtons();
            $scope.initializeResultList();
            $this.getContactStats();
            $this.selectedUsers();

        });

    };

    $this.addNewGroup = function () {

        $this.showAddLink = true;
        $this.showAddGroupInput = false;

        contactsService.createGroup( $this.newGroupName, function ( error, response ) {

            if ( response ) {

                $this.getContactStats();

            } else  {

                console.error( error );

            }

        });

    };

    // Toggle users

    $this.toggleUserSelection = function ( employeeID ) {

        var allUsersSelected = true;

        for ( var i = 0, il = $this.contacts.length; i < il; i ++ ) {

            if ( ! $this.contacts[ i ].selected ) {

                allUsersSelected = false;

            }

        }

        $this.selectedUsers( _.some( $this.contacts, [ 'selected', true ] ) );
        $this.allUsersSelected = allUsersSelected;

    };

    $this.toggleAllSelection = function () {

        for ( var i = 0, il = $this.contacts.length; i < il; i ++ ) {

            $this.contacts[ i ].selected = ! $this.allUsersSelected;

        }

        $this.selectedUsers( _.every( $this.contacts, [ 'selected', true ] ) );

    };

    $this.toggleUserLayout = function ( layout ) {

        $this.layout = layout;

    };

    $scope.getSelectedUsersList = function () {

        $this.selectedUsersUid.length = 0;

        for ( var i = 0, il = $this.contacts.length; i < il; i ++ ) {

            if ( $this.contacts[ i ].selected ) {

                $this.selectedUsersUid.push( $this.contacts[ i ].uid );

            }

        }

        return $this.selectedUsersUid;

    };

    $this.selectedUsers = function ( selected ) {

        if ( selected ) {

            $this.disableAdd = false;
            $this.disableRemove = false;
            $this.disableGrRemove = false;

        } else {

            $this.disableAdd = true;
            $this.disableRemove = true;
            $this.disableGrRemove = true;

        }

    };

    // Contacts types

    $this.selectContactsType = function ( query ) {

        $this.findUser = '';
        $this.querySearch = '';
        $this.query = query;
        $this.selectedGroup = false;
        $this.selectedContacts = true;
        $this.allContacts = false;
        $this.disableButtons();

        $scope.pagination = {
            noOfPages: 1,
            currentPage: 0,
            pageSize: 20
        };

        $scope.loadingResult = false;
        contactsService.setCurrentType( query )
        $this.contacts.length = 0;
        $scope.loadMoreCourses( $this.query );
        $this.selectedUsers();

    };

    // Group contacts

    $this.getGroupContacts = function ( groupId, type ) {

        $this.querySearch = '';
        $this.findUser = '';
        $this.query = '';
        $this.selectedGroup = groupId;
        $this.selectedContacts = false;

        //

        if ( groupId === false ) {

            $scope.loadingResult = false;
            $this.contacts.length = 0;
            $scope.pagination = {
                noOfPages: 1,
                currentPage: 0,
                pageSize: 20
            };

            $this.disableButtons();
            $this.allContacts = true;
            $this.selectedUsers();
            contactsService.setCurrentType( type );
            $scope.loadMoreCourses( type );

        } else {

            contactsService.setCurrentGroup( groupId );
            contactsService.setCurrentType( 'group' );

            $scope.loadingResult = false;
            $this.contacts.length = 0;
            $scope.pagination = {
                noOfPages: 1,
                currentPage: 0,
                pageSize: 20
            };

            $this.allContacts = false;
            $this.disableButtons();
            $scope.loadMoreCourses( type, groupId );

        }

    };

    $this.groupContactsList = function ( query ) {

        $scope.initializeGroupsList( query )

    };

    $scope.$on('$destroy', function () {

        contactsService.destroyCurrentType()
        contactsService.destroyCurrentGroup()
        document.querySelector('.app-content').removeEventListener( 'scroll', addScroll );

    });

    //

    $this.getContactStats();

}])