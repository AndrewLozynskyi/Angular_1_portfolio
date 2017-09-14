/*
 * @author illya, ohmed
 * Admin: Role Detailes page directive
*/

angular.module( 'Admin.module' )

.directive( 'roleDetails', [ function () {

    return {
        restrict: 'E',
        scope: {},
        controllerAs: 'pc',
        templateUrl: 'admin/directives/role-details.html',
        controller: [ '$rootScope', '$scope', 'roles.service', '$mdDialog', '$cookies', 'users.service', function ( $rootScope, $scope, rolesService, $mdDialog, $cookies, usersService ) {

            var $this = this;

            $scope.role = false;

            //

            $this.back = function () {

                $scope.$emit( 'hideDetails' );
                $rootScope.$emit( 'back', true );

            };

            $scope.enableEditMode = function () {

                $mdDialog.show({
                    locals: { test: 1 },
                    parent: angular.element( document.body ),
                    template: '<md-dialog class="permission-edit-confirm" aria-label="Permission edit confirm"><permission-edit-confirm></permission-edit-confirm></md-dialog>',
                    targetEvent: event,
                    clickOutsideToClose: true,
                    onRemoving: function () {

                        setTimeout( function () {

                            $this.roleEditPermissionsToken = $cookies.get('rolePermissionsUpdateToken');
                            var uid = $cookies.get('uid');

                            usersService.isRoleEditPermissionsTokenValid( uid, $this.roleEditPermissionsToken, function ( isValid ) {

                                if ( isValid ) {

                                    $scope.editMode = true;
                                    $scope.$broadcast( 'editMode', true );

                                }

                            });

                        }, 10 );

                    }
                });

            };

            //

            $scope.$on('roleData', function ( event, role ) {

                $scope.role = role;

            });

        }]
    };

}]);
