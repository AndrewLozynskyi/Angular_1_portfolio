/*
 * @author ohmed
 * Admin: Role Detailes page [permissions tab] directive
*/

angular.module( 'Admin.module' )

.directive( 'roleDetailsPermissions', [ function () {

    return {
        restrict: 'E',
        scope: {
            roleData: '='
        },
        controllerAs: 'pc',
        templateUrl: 'admin/directives/role-details-permissions.html',
        controller: [ '$scope', 'roles.service', 'users.service', 'groups.service', '$cookies', function ( $scope, rolesService, usersService, groupsService, $cookies ) {

            var $this = this;

            $this.role = false;
            $this.editMode = false;
            $scope.active = false;

            //

            $this.save = function () {

                rolesService
                .updatePermissions( [ $scope.role ] )
                .then( function () {

                    $scope.editMode = false;
                    $cookies.remove( 'rolePermissionsUpdateToken', { path: '/' } );

                });

            };

            $this.cancel = function () {

                $scope.editMode = false;
                $cookies.remove( 'rolePermissionsUpdateToken', { path: '/' } );

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

            $scope.activateCheckboxes = function () {

                $scope.active = ! $scope.active;

            };

            $scope.isThisDisabled = function ( value ) {

                if ( value && $scope.editMode ) {

                    return false;

                }

                return true;

            };

            $this.initCheckboxes = function () {

                checkIfAllChecked( $this.role.permissions );

                //

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

            //

            function init ( data ) {

                $this.role = data;
                $scope.role = data;

                $this.initCheckboxes();

            };

            $scope.$on( 'roleData', function ( event, data ) {

                if ( ! data ) return;
                init( data );

            });

            $scope.$on( 'editMode', function ( event, value ) {

                $scope.editMode = value;

            });

        }]
    };

}]);
