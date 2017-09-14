/*
 * @author Illya, ohmed
 * Admin 'Permission' screen controller
*/

angular.module( 'Admin.module' )

.controller( 'permissions.controller', [ '$scope', 'roles.service', 'users.service', '$mdDialog', '$cookies', function ( $scope, rolesService, usersService, $mdDialog, $cookies ) {

    var $this = this;
    $scope.roles = [];
    $scope.allRoles = [];
    $scope.editMode = false;
    $scope.hOffset = 0;
    $scope.active = false;
    $this.roleEditPermissionsToken = $cookies.get('rolePermissionsUpdateToken');

    //

    $scope.save = function () {

        rolesService
        .updatePermissions( $scope.roles )
        .then( function () {

            $scope.editMode = false;
            $cookies.remove('rolePermissionsUpdateToken', { path: '/' });

        });

    };

    $scope.cancel = function () {

        $scope.editMode = false;
        $cookies.remove('rolePermissionsUpdateToken', { path: '/' });

    };

    $scope.showLeft = function () {

        $scope.hOffset = ( $scope.hOffset > 0 ) ? $scope.hOffset - 1 : 0;
        $scope.roles = $scope.allRoles.slice( $scope.hOffset, 4 + $scope.hOffset );
        $scope.initCheckboxes();

    };

    $scope.showRight = function () {

        $scope.hOffset = ( $scope.hOffset < $scope.allRoles.length - 4 ) ? $scope.hOffset + 1 : $scope.hOffset;
        $scope.roles = $scope.allRoles.slice( $scope.hOffset, 4 + $scope.hOffset );
        $scope.initCheckboxes();

    };

    $scope.toggleAll = function ( category ) {

        for ( var item in category ) {

            if ( item === 'all' ) {

                continue;

            }

            category[ item ] = ! category['all'];
            category['moduleEnabled'] = true;

        }

    };

    $scope.optionToggled = function ( category ) {

        var allChecked = true;

        for ( var item in category ) {

            if ( item === 'all' ) {

                continue;

            }

            if ( ! category[ item ]  ) {

                allChecked = false;
                break;

            }

        }

        category['all'] = allChecked;

    };

    $scope.initCheckboxes = function () {

        for ( var i = 0, il = $scope.roles.length; i < il; i ++ ) {

            checkIfAllChecked( $scope.roles[ i ] );

        }

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

    $scope.enableEditMode = function () {

        $mdDialog.show({
            parent: angular.element( document.body ),
            template: '<md-dialog class="permission-edit-confirm" aria-label="Permission edit confirm"><permission-edit-confirm></permission-edit-confirm></md-dialog>',
            targetEvent: event,
            clickOutsideToClose: true,
            onRemoving: function ( event, removePromise ) {

                $this.roleEditPermissionsToken = $cookies.get('rolePermissionsUpdateToken');
                var uid = $cookies.get('uid');

                usersService.isRoleEditPermissionsTokenValid( uid, $this.roleEditPermissionsToken, function ( isValid ) {

                    if ( isValid ) {

                        $scope.editMode = true;

                    }

                });

            }
        });

    };

    $scope.activateCheckboxes = function () {

        $scope.active = !$scope.active;

    };

    $scope.isThisDisabled = function ( value ) {

        if ( value && $scope.editMode ) {

            return false;

        }

        return true;

    };

    $this.init = function () {

        rolesService.getList()
        .then( function ( data ) {

            $scope.allRoles = data;
            $scope.showLeft();
            $scope.initCheckboxes();

        });

    };

    //

    $this.init();

}]);
