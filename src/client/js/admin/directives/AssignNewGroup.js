/*
 * @author Illya
 * 'Assign new group' to a role directive
*/

angular.module( 'Admin.module' )

.directive( 'assignNewGroup', [ function () {

    return {
        restrict: 'EA',
        scope: {
            roleId: '='
        },
        controllerAs: 'ang',
        templateUrl: 'admin/directives/assign-new-group.html',
        controller: [ '$scope', 'groups.service', 'roles.service', '$mdDialog', function ( $scope, groupsService, rolesService, $mdDialog ) {

            var $this = this;

            $this.groupsList = [];
            $this.readonly = false;
            $this.selectedGroups = [];
            $this.groupsIds = [];
            $this.groupsListIds = [];

            //

            $this.createGroup = function () {

                var name = angular.element('.div-input').val();

                groupsService.create( name )
                .then( function ( response ) {

                    $this.init();
                    $scope.activeSlide = false;

                });

            };

            $this.save = function () {

                var groups = $this.getSelectedGroupsIds();

                for ( var i = 0, il = groups.length; i < il; i ++ ) {

                    groupsService
                    .addRole( groups[ i ], $scope.roleId )
                    .then( function ( response ) { } );

                    $mdDialog.cancel();

                }

            };

            $this.cancel = function () {

                $mdDialog.cancel();

            };

            $this.openNewGroupUI = function () {

                angular.element('.div-input').attr( 'placeholder', 'New Group Name' );

            };

            $this.getSelectedGroupsIds = function () {

                var selectedGroupsIds = [];

                for ( var i = 0; i < $this.groupsList.length; i ++ ) {

                    if ( $this.selectedGroups.indexOf( $this.groupsList[ i ].name ) !== -1 ) {

                        selectedGroupsIds.push( $this.groupsList[ i ].groupId );

                    }

                }

                return selectedGroupsIds;

            };

            $this.getRoleGroups = function () {

                rolesService
                .getGroups( $scope.roleId, ( $this.currentPage - 1 ) * $this.itemsPerPage, $this.itemsPerPage )
                .then( function ( groups ) {

                    for ( var i = 0; i < groups.length; i ++ ) {

                        $this.groupsIds.push( groups[ i ].groupId );

                    }

                    groupsService.getList()
                    .then( function ( response ) {

                        $this.groupsList = response.data.message;

                        for ( var i = 0; i < $this.groupsList.length; i ++ ) {

                            $this.groupsListIds.push( $this.groupsList[ i ] )

                        }

                        $this.checkGroups();

                    });

                });

            };

            $this.checkGroups = function () {

                $this.groupsList.length = 0;

                function exists ( element ) {

                    return element === $this.groupsListIds[ i ].groupId;

                };

                for ( var i = 0; i < $this.groupsListIds.length; i ++ ) {

                    if ( ! $this.groupsIds.some( exists ) ) {

                        $this.groupsList.push( $this.groupsListIds[ i ] )

                    }

                }

            };

            //

            $this.init = function () {

                $this.getRoleGroups();

            };

            //

            window.mdSelectOnKeyDownOverride = function ( event ) {

                event.stopPropagation();

            };

            $this.init();

        }]
    };

}]);
