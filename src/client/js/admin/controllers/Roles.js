/*
 * @author Illya, ohmed
 * Admin 'Roles' tab controller
*/

angular.module( 'Admin.module' )

.controller( 'roles.controller', [ '$rootScope', '$scope', 'roles.service', 'users.service', '$mdDialog', '$cookies', function ( $rootScope, $scope, rolesService, usersService, $mdDialog, $cookies ) {

    var $this = this;

    var items = [];
    this.showDet = false;
    $scope.isDisabled = false;
    $scope.showDet = $this.showDet;

    //

    $scope.$on('roleChecked', function ( event, data ) {

        $scope.data = data;

        if ( data.length > 0 ) {

            $scope.isDisabled = false;

        } else {

            $scope.isDisabled = true;

        }

    });

    $scope.$on('role', function ( event, data ) {

        $scope.roleName = data.name;
        $scope.roleId = data.roleId;
        $scope.getDetailes( $scope.roleId );

    });

    $scope.$on( 'hideDetails', function ( event, hideDetails ) {

        $this.showDet = false;

    });

    $scope.deleteRole = function () {

        // todo

    };

    $scope.getDetailes = function ( roleId ) {

        rolesService
        .getDetailes( roleId )
        .then( function ( role ) {

            $rootScope.$broadcast( 'roleData', role );

        });

    };

    $scope.refreshRoles = function () {

        rolesService
        .setDataTable()
        .then( function() {

            $scope.data.length = 0;
            items.length = 0;
            $scope.$broadcast( 'checkItem', items );

        });

    };

    $this.hideDetails = function () {

        this.showDet = ! this.showDet;
        $scope.refreshRoles();

    };

    $scope.createEditRole = function ( roleId, action ) {

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

                        $mdDialog.show({
                            parent: angular.element( document.body ),
                            template: '<md-dialog class="create-role" aria-label="Role create"><create-role action="' + action + '" roleId="' + roleId + '" ></create-role></md-dialog>',
                            targetEvent: event,
                            clickOutsideToClose: true,
                            escapeToClose: true,
                            onRemoving: function ( event, removePromise ) {

                                $scope.refreshRoles();
                                $cookies.remove( 'rolePermissionsUpdateToken', { path: '/' } );
                                $scope.$broadcast( 'editMode', true );

                            }
                        });

                    }

                });

            }
        }).finally( function () {

            console.log( $this.roleEditPermissionsToken, uid );

        });

    };

    $scope.deleteRole = function ( roleId ) {

        $mdDialog.show({
            parent: angular.element( document.body ),
            template: '<md-dialog class="delete-role" aria-label="Role delete"><delete-role roleId="' + roleId + '"></delete-role></md-dialog>',
            targetEvent: event,
            clickOutsideToClose: true,
            escapeToClose: true
        })
        .finally( function () {

            $scope.refreshRoles();

        });

    };

}]);
