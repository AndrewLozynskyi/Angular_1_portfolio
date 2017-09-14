/*
 * @author ohmed
 * Admin: Role Detailes page [groups tab] directive
*/

angular.module( 'Admin.module' )

.directive( 'roleDetailsGroups', [ function () {

    return {
        restrict: 'E',
        scope: {
            roleData: '='
        },
        controllerAs: 'rdg',
        templateUrl: 'admin/directives/role-details-groups.html',
        controller: [ '$rootScope', '$scope', 'roles.service', 'users.service', 'groups.service', '$mdDialog', function ( $rootScope, $scope, rolesService, usersService, groupsService, $mdDialog ) {

            var $this = this;

            $this.role = false;

            $this.groups = [];
            $this.itemsPerPage = 10;
            $this.groupMaxPage = 0;
            $this.currentPage = 1;
            $this.selectedGroupsGid = [];
            $this.isDisabled = true;
            $this.allGroupsSelected = false;

            //

            $this.setItemsPerPage = function ( value ) {

                $this.itemsPerPage = value;

            };

            $this.changePage = function () {

                if ( ! $this.role ) return;

                rolesService
                .getGroups( $this.role.roleId, ( $this.currentPage - 1 ) * $this.itemsPerPage, $this.itemsPerPage )
                .then( function ( groups ) {

                    $this.groupMaxPage = Math.ceil( groups.length / $this.itemsPerPage );
                    $this.groups = groups;

                });

            };

            $this.assignNewGroup = function ( event ) {

                $scope.roleId = $this.role.roleId;

                $mdDialog.show({
                    parent: angular.element( document.body ),
                    scope: $scope.$new(),
                    template: '<md-dialog class="mobile-add" aria-label="contacts"><assign-new-group role-id="roleId"></assign-new-group></md-dialog>',
                    targetEvent: event,
                    clickOutsideToClose: true
                }).finally( function () {

                    rolesService
                    .getGroups( $this.role.roleId, ( $this.currentPage - 1 ) * $this.itemsPerPage, $this.itemsPerPage )
                    .then( function ( groups ) {

                        $this.groups = groups;
                        $scope.$emit( 'groups', $this.groups )

                    });

                    rolesService
                    .getDetailes( $this.role.roleId )
                    .then( function ( role ) {

                        $this.role = role;

                    });

                })

            };

            $this.assignToRole = function ( event ) {

                $mdDialog.show({
                    parent: angular.element( document.body ),
                    scope: $scope.$new(),
                    template: '<md-dialog class="mobile-add" aria-label="contacts"><assign-to-role groups-list="getSelectedGroupsList()"></assign-to-role></md-dialog>',
                    targetEvent: event,
                    clickOutsideToClose: true
                }).finally( function () {

                    $this.allUsersSelected = false;

                    rolesService
                    .getGroups( $this.role.roleId, ( $this.currentPage - 1 ) * $this.itemsPerPage, $this.itemsPerPage )
                    .then( function ( groups ) {

                        $this.groups = groups;
                        $scope.$emit( 'groups', $this.groups )

                    });

                });

            };

            $scope.getSelectedGroupsList = function () {

                $this.selectedGroupsGid.length = 0;

                for ( var i = 0, il = $this.groups.length; i < il; i ++ ) {

                    if ( $this.groups[ i ].selected ) {

                        $this.selectedGroupsGid.push( $this.groups[ i ].groupId );

                    }

                }

                return $this.selectedGroupsGid;

            };

            $this.selectedGroups = function ( selected ) {

                if ( selected ) {

                    $this.isDisabled = false;

                } else {

                    $this.isDisabled = true;

                }

            };

            $this.toggleAllSelection = function () {

                for ( var i = 0, il = $this.groups.length; i < il; i ++ ) {

                    $this.groups[ i ].selected = ! $this.allGroupsSelected;

                }

                $this.selectedGroups( _.every( $this.groups, [ 'selected', true ] ) );

            };

            $this.toggleGroupSelection = function () {

                var allGroupsSelected = true;

                for ( var i = 0, il = $this.groups.length; i < il; i ++ ) {

                    if ( ! $this.groups[ i ].selected ) {

                        allGroupsSelected = false;

                    }

                }

                $this.selectedGroups( _.some( $this.groups, [ 'selected', true ] ) );
                $this.allGroupsSelected = allGroupsSelected;

            };

            //

            function init ( data ) {

                $this.role = data;
                $this.changePage();

            };

            $scope.$on( 'roleData', function ( event, data ) {

                if ( ! data ) return;
                init( data );

            });

            $rootScope.$on('groups', function ( event, data ) {

                $this.groups = data;

            });

        }]
    };

}]);
