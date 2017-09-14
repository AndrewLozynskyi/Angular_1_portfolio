/*
 * @author Markiyan, ohmed
 * PermissionEdit auth confirmation
*/

angular.module( 'Admin.module' )

.directive( 'permissionEditConfirm', [ function () {

    return {
        restrict: 'E',
        scope: {},
        controllerAs: 'pec',
        templateUrl: 'admin/directives/permission-edit-confirm.html',
        controller: [ '$scope', '$mdDialog', '$cookies', 'users.service', function ( $scope, $mdDialog, $cookies, usersService ) {

            var $this = this;

            $this.login = $cookies.get('email');
            $this.password = '';

            //

            $this.confirm = function () {

                var uid = $cookies.get('uid');
                var password = $this.password;

                usersService.getRolePermissionsUpdateToken( uid, password, function ( result ) {

                    if ( result.token ) {

                        $mdDialog.cancel();

                    } else {

                        alert('Wrong password [proper error notification will be added later]');

                    }

                });

            };

            $this.cancel = function () {

                $mdDialog.cancel();

            };

        }]
    };

}]);
