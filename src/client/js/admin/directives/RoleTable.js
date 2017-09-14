/*
 * @author illya, ohmed
 * Admin: Role Table page directive
*/

angular.module( 'Admin.module' )

.directive( 'roleTable', [ function () {

    return {
        restrict: 'E',
        scope: {
            showDet: '=',
            createEditRole: '=',
            deleteRole: '='
        },
        controllerAs: 'rt',
        templateUrl: 'admin/directives/role-table.html',
        controller: [ '$scope', 'roles.service', '$mdDialog',  function ( $scope, rolesService, $mdDialog ) {

            var $this = this;
            $scope.service = rolesService;
            $scope.items = [];
            $scope.selected = [];
            $scope.isDisabled = false;

            //

            $this.showDetails = function ( item ) {

                $scope.$emit( 'role', item );
                $scope.showDet = true;
                $scope.name = item.name;
                $scope.roleId = item.roleId;

            };

            $scope.refreshRoles = function () {

                rolesService.setDataTable()
                .then( function () {

                    $scope.selected.length = 0;
                    $scope.items.length = 0;

                });

            };

            $scope.enableEditMode = function () {

                $scope.$emit( 'checkAuth', 'data' );

            };

            $scope.toggle = function ( item, list ) {

                var idx = list.indexOf( item );

                if ( idx > -1 ) {

                    list.splice( idx, 1 );

                } else {

                    list.push( item );

                }

            };

            $scope.exists = function ( item, list ) {

                return ( list.indexOf( item ) > -1 );

            };

            $scope.isChecked = function () {

                $scope.$emit( 'roleChecked', $scope.selected );

                if ( $scope.selected.length > 0 ) {

                    $scope.isDisabled = false;

                } else {

                    $scope.isDisabled = true;

                }

                return ( $scope.selected.length === $scope.items.length && $scope.items.length !== 0 );

            };

            $scope.toggleAll = function () {

                if ( $scope.selected.length === $scope.items.length ) {

                    $scope.selected = [];

                } else if ( $scope.selected.length === 0 || $scope.selected.length > 0 ) {

                    $scope.selected = $scope.items.slice(0);

                }

            };

            $this.checkAll = function () {

                for ( var i = 0; i < this.dataTable.length; i ++ ) {

                    this.dataTable[ i ].checked = this.allChecked;

                }

            };

            //

            $scope.$watch('service.getDataTable()', function ( value ) {

                $this.dataTable = value;

                for ( var i = 0; i < $this.dataTable.length; i ++ ) {

                    $scope.items.push( $this.dataTable[ i ].roleId );
                    $this.dataTable[ i ].checked = false;

                }

            });

            $scope.$on('checkItem', function ( event, items ) {

                $scope.items = items;

            });

            //

            rolesService.setDataTable();
            this.dataTable = rolesService.getDataTable();

            for ( var i = 0; i < this.dataTable.length; i ++ ) {

                this.dataTable[ i ].checked = false;

            }

        }]
    };

}]);
