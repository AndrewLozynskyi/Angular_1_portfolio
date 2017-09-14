/*
 * @author ohmed, Illya
 * Contacts controller
 */

angular.module( 'Contacts.module' )

.directive( 'addContactsToGroups', [ function () {

    return {
        restrict: 'EA',
        scope: {
            contactsList: '='
        },
        controllerAs: 'acg',
        templateUrl: 'profile/directives/add-contacts-to-group.html',
        controller: [ '$scope', 'contacts.service', '$mdDialog', '$cookies', function ( $scope, contactsService, $mdDialog, $cookies ) {

            var $this = this;
            var userId = $cookies.get('uid');
            $this.newGroupName = '';
            $this.contactsStats = {};
            $this.readonly = false;
            $this.selectedContactsGroups = [];

            //

            window.mdSelectOnKeyDownOverride = function ( event ) {

                event.stopPropagation();

            };

            $this.save = function () {

                var groups = $this.getSelectedContactsGroupsIds();

                for ( var i = 0, il = groups.length; i < il; i ++ ) {

                    contactsService.addContactsToGroup( groups[ i ], $scope.contactsList )
                    .then( function ( response ) {

                        $mdDialog.cancel();

                    });

                }

            };

            $this.cancel = function () {

                $mdDialog.cancel();

            };

            $this.createGroup = function () {

                var name = angular.element('.div-input').val();

                contactsService.createGroup( name, function ( error, response ) {

                    if ( response ) {

                        $this.init();
                        $scope.activeSlide = false;

                    } else  {

                        console.error( error );

                    }

                });

            };

            $this.openNewGroupUI = function () {

                angular.element('.div-input').attr( 'placeholder', 'New Group Name' );

            };

            $this.getSelectedContactsGroupsIds = function () {

                var selectedContactsGroupsIds = [];

                for ( var i = 0; i < $this.contactsStats.length; i ++ ) {

                    if ( $this.selectedContactsGroups.indexOf( $this.contactsStats[ i ].name ) !== -1 ) {

                        selectedContactsGroupsIds.push( $this.contactsStats[ i ].groupId );

                    }

                }

                return selectedContactsGroupsIds;

            };

            //

            $this.init = function () {

                contactsService.getContactsStats( userId )
                .then( function ( response ) {

                    $this.contactsStats = response.data.message.message.groups;

                });

            };

            //

            $this.init();

        }]
    };

}]);
