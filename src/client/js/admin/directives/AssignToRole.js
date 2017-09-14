/*
 * @author Illya, ohmed
 * 'Add users to group' popup directive
*/

angular.module( 'Admin.module' )

.directive( 'assignToRole', [ function () {

    return {
        restrict: 'EA',
        scope: {
            usersList:  '=',
            groupsList: '='
        },
        controllerAs: 'atr',
        templateUrl: 'admin/directives/assign-to-role.html',
        controller: [ '$scope', 'roles.service', 'groups.service', '$mdDialog', '$cookies', function ( $scope, rolesService, groupsService, $mdDialog, $cookies ) {

            var $this = this;

            $this.rolesList = [];
            $this.readonly = false;
            $this.selectedRoles = [];
            $this.session = $cookies.get('session');

            //

            $this.save = function () {

                var roles = $this.getSelectedRolesIds();

                for ( var i = 0, il = roles.length; i < il; i ++ ) {

                    if ( $scope.groupsList ) {

                        groupsService
                        .addRole( $scope.groupsList, roles[ i ] )
                        .then( function ( response ) {

                            $mdDialog.cancel();

                        });

                    } else if ( $scope.usersList ) {

                        rolesService
                        .addUsers( $scope.usersList, roles[ i ], $this.session )
                        .then( function ( response ) {

                            $mdDialog.cancel();

                        });

                    }

                }

            };

            $this.cancel = function () {

                $mdDialog.cancel();

            };

            $this.getSelectedRolesIds = function () {

                var selectedRolesIds = [];

                for ( var i = 0; i < $this.rolesList.length; i ++ ) {

                    if ( $this.selectedRoles.indexOf( $this.rolesList[ i ].name ) !== -1 ) {

                        selectedRolesIds.push( $this.rolesList[ i ].roleId );

                    }

                }

                return selectedRolesIds;

            };

            //

            $this.init = function () {

                rolesService
                .getList()
                .then( function ( response ) {

                    $this.rolesList = response;

                });

            };

            //

            $this.init();

        }]
    };

}]);
