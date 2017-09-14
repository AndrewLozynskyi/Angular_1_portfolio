/*
 * @author Illya
 * Role delete popup directive
*/

angular.module( 'Admin.module' )

.directive( 'deleteRole', [ function () {

    return {
        restrict: 'E',
        scope: {},
        controllerAs: 'dr',
        templateUrl: 'admin/directives/delete-role-first.html',
        controller: [ '$scope', 'roles.service', '$mdDialog', '$element', function ( $scope, rolesService, $mdDialog, $element ) {

            var $this = this;

            var roleId = $element.attr('roleId');

            $this.roleIdArr = [];
            $this.roleName  = [];
            $this.userCount = [];
            $this.tempCount = [];
            $this.permanentCount = [];

            $this.noUsers = false;
            $this.oneUser = false;
            $this.manyUsers = false;
            $this.permanent = false;

            //

            $this.getRoleName = function () {

                rolesService
                .getList()
                .then( function ( res ) {

                    $this.roleIdArr = roleId.split(',');

                    for ( var i = 0; i < res.length; i ++ ) {

                        for ( var j = 0; j < $this.roleIdArr.length; j ++ ) {

                            if ( $this.roleIdArr[ j ] == res[ i ].roleId ) {

                                $this.roleName.push( res[ i ].name );
                                $this.userCount.push( res[ i ].userCount );

                                if ( res[ i ].permanent ) {

                                    $this.permanentCount.push ( res[ i ].permanent );

                                }

                            }

                        }

                    }

                    for ( var i = 0; i <  $this.userCount.length; i ++ ) {

                        if ( $this.userCount[ i ] > 0 ) {

                            $this.tempCount.push( $this.userCount[ i ] );

                        }

                    }

                    if ( $this.roleName.length === 1 &&  $this.userCount[ 0 ] === 0 && $this.permanentCount.length === 0 ) {

                        $this.noUsers = true;

                    } else if ( $this.roleName.length === 1 &&  $this.userCount[ 0 ] === 1 && $this.permanentCount.length === 0 ) {

                        $this.oneUser = true;

                    } else if ( $this.roleName.length > 0 &&  $this.tempCount.length > 0 && $this.permanentCount.length === 0 ) {

                        $this.manyUsers = true;

                    } else if ( $this.permanentCount.length > 0 ) {

                        $this.permanent = true;

                    } else {

                        $this.noUsers = true;

                    }

                    $this.roleName = [];
                    $this.roleName.push( $this.roleName.join(', ') );

                });

            } ();

            $this.cancel = function () {

                $mdDialog.cancel();

            };

            $this.delete = function () {

                rolesService
                .delete( roleId )
                .then( function () {

                    rolesService.setDataTable();
                    $this.cancel();

                });

            };

        }]
    };

}]);
