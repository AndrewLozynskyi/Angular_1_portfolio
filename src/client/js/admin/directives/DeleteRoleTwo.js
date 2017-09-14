/*
 * @author Illya
 * Role's [more then one] delete popup directive
*/

angular.module( 'Admin.module' )

.directive( 'deleteRoleTwo', [ function () {

    return {
        restrict: 'E',
        scope: {},
        controllerAs: 'drt',
        templateUrl: 'admin/directives/delete-role-second.html',
        controller: [ '$scope', '$mdDialog', function ( $scope, $mdDialog ) {

            var $this = this;

            $this.cancel = function () {

                $mdDialog.cancel();

            };

        }]
    };

}]);
